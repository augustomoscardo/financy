# Paginação Client-Side (Implementação Atual)

## 📋 Visão Geral

A paginação client-side carrega **todos os dados** de uma só vez e faz a divisão das páginas no frontend.

## ✅ Vantagens

- Resposta instantânea ao mudar de página (sem requisições HTTP)
- Filtros funcionam instantaneamente
- Simples de implementar
- Bom para datasets pequenos/médios (até ~1000 registros)

## ❌ Desvantagens

- Carrega todos os dados de uma vez (lento para muitos registros)
- Maior uso de memória no navegador
- Performance diminui com muitos dados

---

## 🎯 Implementação Completa

### 1. **Setup Básico e Estado**

```tsx
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@apollo/client/react";
import { GET_TRANSACTIONS } from "@/lib/graphql/queries/transaction";
import { GET_CATEGORIES } from "@/lib/graphql/queries/category";

export function Transactions() {
  // Formulário para filtros
  const form = useForm({
    defaultValues: {
      title: '',
      type: 'all',
      category: 'all',
      period: 'all'
    }
  });

  // Buscar TODAS as transações e categorias
  const { data, loading } = useQuery<{ getTransactions: Transaction[] }>(GET_TRANSACTIONS);
  const { data: categoriesData } = useQuery<{ getCategories: Category[] }>(GET_CATEGORIES);

  const allTransactions = data?.getTransactions || [];
  const categories = categoriesData?.getCategories || [];

  // Estado de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Observar valores dos filtros em tempo real
  const filters = form.watch();
```

### 2. **Lógica de Filtragem**

```tsx
// Filtrar transações baseado nos filtros selecionados
const filteredTransactions = useMemo(() => {
  return allTransactions.filter((transaction) => {
    // Filtro de busca por título
    if (
      filters.title &&
      !transaction.title.toLowerCase().includes(filters.title.toLowerCase())
    ) {
      return false;
    }

    // Filtro de tipo
    if (
      filters.type &&
      filters.type !== "all" &&
      transaction.type !== filters.type
    ) {
      return false;
    }

    // Filtro de categoria
    if (
      filters.category &&
      filters.category !== "all" &&
      transaction.categoryId !== filters.category
    ) {
      return false;
    }

    // Filtro de período
    if (filters.period && filters.period !== "all") {
      // Implementar lógica de período
      const transactionDate = new Date(transaction.date);
      const [month, year] = filters.period.split("_"); // Ex: "november_2025"

      if (month && year) {
        const monthMap = {
          january: 0,
          february: 1,
          march: 2,
          april: 3,
          may: 4,
          june: 5,
          july: 6,
          august: 7,
          september: 8,
          october: 9,
          november: 10,
          december: 11,
        };

        const expectedMonth = monthMap[month as keyof typeof monthMap];
        const expectedYear = parseInt(year);

        if (
          transactionDate.getMonth() !== expectedMonth ||
          transactionDate.getFullYear() !== expectedYear
        ) {
          return false;
        }
      }
    }

    return true;
  });
}, [allTransactions, filters]);
```

### 3. **Cálculos de Paginação**

```tsx
// Calcular informações de paginação
const totalItems = filteredTransactions.length;
const totalPages = Math.ceil(totalItems / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

// Resetar para página 1 quando filtros mudarem
useMemo(() => {
  setCurrentPage(1);
}, [filters.title, filters.type, filters.category, filters.period]);
```

### 4. **Funções de Navegação**

```tsx
// Ir para uma página específica
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
  }
};

// Página anterior
const goToPreviousPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

// Próxima página
const goToNextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};
```

### 5. **Geração de Números de Página (com Ellipsis)**

```tsx
// Gerar array de páginas para exibir (1 ... 5 6 7 ... 15)
const getPageNumbers = () => {
  const pages: (number | string)[] = [];
  const maxPagesToShow = 5;

  if (totalPages <= maxPagesToShow) {
    // Se tiver poucas páginas, mostra todas
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Lógica para mostrar páginas com "..."
    if (currentPage <= 3) {
      // Início: [1] [2] [3] [4] ... [15]
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Fim: [1] ... [12] [13] [14] [15]
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Meio: [1] ... [5] [6] [7] ... [15]
      pages.push(1);
      pages.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    }
  }

  return pages;
};
```

### 6. **Renderização da Tabela**

```tsx
  return (
    <Page>
      {/* Header e Filtros ... */}

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Renderizar apenas transações da página atual */}
            {currentTransactions.length > 0 && !loading && currentTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.title}</TableCell>
                <TableCell>{format(transaction.date, "dd/MM/yyyy")}</TableCell>
                <TableCell>{transaction.category.name}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>R$ {transaction.amount}</TableCell>
                <TableCell>{/* Ações */}</TableCell>
              </TableRow>
            ))}

            {/* Estado vazio */}
            {currentTransactions.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Nenhuma transação encontrada
                </TableCell>
              </TableRow>
            )}

            {/* Loading */}
            {loading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
```

### 7. **Footer com Paginação**

```tsx
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="p-0 bg-white">
                <div className="py-5 px-6 flex items-center justify-between w-full">
                  {/* Contador de resultados */}
                  <span className="text-gray-700 text-sm">
                    {totalItems > 0
                      ? `${startIndex + 1} a ${Math.min(endIndex, totalItems)}`
                      : '0'
                    } | {totalItems} {totalItems === 1 ? 'resultado' : 'resultados'}
                  </span>

                  {/* Controles de paginação */}
                  <div className="flex items-center gap-2">
                    {/* Botão Previous */}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1 || totalPages === 0}
                    >
                      <ChevronLeft size={16} />
                    </Button>

                    {/* Números de página */}
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-2">
                          ...
                        </span>
                      ) : (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="icon"
                          className={currentPage === page ? 'bg-brand-base' : ''}
                          onClick={() => goToPage(page as number)}
                        >
                          {page}
                        </Button>
                      )
                    ))}

                    {/* Botão Next */}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Card>
    </Page>
  );
}
```

---

## 🎨 Melhorias Opcionais

### Debounce no Campo de Busca

```tsx
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce"; // ou criar custom hook

function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

  // Usar debouncedSearchTerm nos filtros
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((transaction) => {
      if (
        debouncedSearchTerm &&
        !transaction.title
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
      ) {
        return false;
      }
      // ... outros filtros
    });
  }, [allTransactions, debouncedSearchTerm /* outros filtros */]);
}
```

### Custom Hook use-debounce

```tsx
// hooks/use-debounce.ts
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

---

## 📊 Quando Usar Client-Side?

✅ **Use quando:**

- Você tem menos de 1000 registros
- Precisa de filtros super rápidos
- Não quer complexidade no backend
- Dados não mudam frequentemente
- UX é prioridade (sem delay ao navegar)

❌ **Evite quando:**

- Você tem milhares de registros
- Dados mudam frequentemente
- Precisa economizar banda/memória
- Performance é crítica

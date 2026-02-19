# Paginação Server-Side (Backend + Frontend)

## 📋 Visão Geral

A paginação server-side busca apenas os dados da página atual do backend. Mais escalável e performática.

## ✅ Vantagens

- Carrega apenas os dados necessários (10 por vez)
- Menor uso de memória
- Escalável para milhões de registros
- Menor tráfego de rede

## ❌ Desvantagens

- Requisição HTTP a cada mudança de página
- Implementação mais complexa
- Requer mudanças no backend

---

## 🔧 Implementação Completa

### PARTE 1: Backend (GraphQL)

#### 1. **Schema GraphQL**

```graphql
# schema.graphql
type PaginationInfo {
  currentPage: Int!
  totalPages: Int!
  totalItems: Int!
  itemsPerPage: Int!
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}

type TransactionConnection {
  transactions: [Transaction!]!
  pagination: PaginationInfo!
}

input TransactionFilters {
  title: String
  type: TransactionType
  categoryId: String
  startDate: DateTime
  endDate: DateTime
}

type Query {
  getTransactionsPaginated(
    page: Int = 1
    limit: Int = 10
    filters: TransactionFilters
  ): TransactionConnection!
}
```

#### 2. **Resolver (Backend)**

```typescript
// resolvers/transaction.resolver.ts
import { Resolver, Query, Args, Int } from "@nestjs/graphql";

@Resolver()
export class TransactionResolver {
  @Query(() => TransactionConnection)
  async getTransactionsPaginated(
    @Args("page", { type: () => Int, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Int, defaultValue: 10 }) limit: number,
    @Args("filters", { nullable: true }) filters?: TransactionFilters,
    @CurrentUser() user: User,
  ): Promise<TransactionConnection> {
    // Validar inputs
    const validPage = Math.max(1, page);
    const validLimit = Math.min(100, Math.max(1, limit)); // Max 100 por página
    const skip = (validPage - 1) * validLimit;

    // Build query com filtros
    const where: any = {
      userId: user.id,
    };

    if (filters?.title) {
      where.title = {
        contains: filters.title,
        mode: "insensitive", // Case insensitive
      };
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.date.lte = filters.endDate;
      }
    }

    // Executar queries em paralelo
    const [transactions, totalItems] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: validLimit,
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc", // Ordenar por data
        },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    // Calcular metadados de paginação
    const totalPages = Math.ceil(totalItems / validLimit);
    const hasNextPage = validPage < totalPages;
    const hasPreviousPage = validPage > 1;

    return {
      transactions,
      pagination: {
        currentPage: validPage,
        totalPages,
        totalItems,
        itemsPerPage: validLimit,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }
}
```

---

### PARTE 2: Frontend (React + Apollo)

#### 1. **Query GraphQL**

```typescript
// lib/graphql/queries/transaction.ts
import { gql } from "@apollo/client";

export const GET_TRANSACTIONS_PAGINATED = gql`
  query GetTransactionsPaginated(
    $page: Int!
    $limit: Int!
    $filters: TransactionFilters
  ) {
    getTransactionsPaginated(page: $page, limit: $limit, filters: $filters) {
      transactions {
        id
        title
        amount
        type
        date
        categoryId
        category {
          id
          name
          icon
          color
        }
        createdAt
        updatedAt
      }
      pagination {
        currentPage
        totalPages
        totalItems
        itemsPerPage
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;
```

#### 2. **Types**

```typescript
// types/index.ts
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TransactionConnection {
  transactions: Transaction[];
  pagination: PaginationInfo;
}

export interface TransactionFilters {
  title?: string;
  type?: "income" | "expense";
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
}
```

#### 3. **Componente Principal**

```tsx
// pages/transactions/index.tsx
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@apollo/client/react";
import { GET_TRANSACTIONS_PAGINATED } from "@/lib/graphql/queries/transaction";
import type { TransactionConnection, TransactionFilters } from "@/types";

export function Transactions() {
  // Estado de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Formulário para filtros
  const form = useForm<TransactionFilters>({
    defaultValues: {
      title: "",
      type: undefined,
      categoryId: undefined,
    },
  });

  const filters = form.watch();

  // Query com variáveis de paginação e filtros
  const { data, loading, error, refetch } = useQuery<{
    getTransactionsPaginated: TransactionConnection;
  }>(GET_TRANSACTIONS_PAGINATED, {
    variables: {
      page: currentPage,
      limit: itemsPerPage,
      filters: {
        title: filters.title || undefined,
        type: filters.type !== "all" ? filters.type : undefined,
        categoryId: filters.category !== "all" ? filters.category : undefined,
      },
    },
    fetchPolicy: "cache-and-network", // Sempre buscar dados frescos
  });

  const transactions = data?.getTransactionsPaginated.transactions || [];
  const pagination = data?.getTransactionsPaginated.pagination;

  // Funções de navegação
  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    // Apollo faz a requisição automaticamente quando currentPage muda
  }, []);

  const goToPreviousPage = useCallback(() => {
    if (pagination?.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [pagination]);

  const goToNextPage = useCallback(() => {
    if (pagination?.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [pagination]);

  // Resetar para página 1 quando filtros mudarem
  const handleFilterChange = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Watch filters e reset página
  useEffect(() => {
    handleFilterChange();
  }, [filters.title, filters.type, filters.category, handleFilterChange]);

  return (
    <Page>
      {/* Filtros */}
      <Card>
        <form onChange={handleFilterChange}>
          <Controller
            name="title"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Buscar</FieldLabel>
                <Input {...field} placeholder="Buscar por descrição" />
              </Field>
            )}
          />
          {/* Outros filtros... */}
        </form>
      </Card>

      {/* Tabela */}
      <Card>
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
            {loading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            )}

            {!loading && transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Nenhuma transação encontrada
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.title}</TableCell>
                  <TableCell>
                    {format(transaction.date, "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{transaction.category.name}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>R$ {transaction.amount}</TableCell>
                  <TableCell>{/* Ações */}</TableCell>
                </TableRow>
              ))}
          </TableBody>

          {/* Footer com paginação */}
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>
                <div className="flex items-center justify-between">
                  {/* Contador */}
                  <span className="text-sm text-gray-700">
                    {pagination && pagination.totalItems > 0 ? (
                      <>
                        {(pagination.currentPage - 1) *
                          pagination.itemsPerPage +
                          1}{" "}
                        a{" "}
                        {Math.min(
                          pagination.currentPage * pagination.itemsPerPage,
                          pagination.totalItems,
                        )}{" "}
                        | {pagination.totalItems}{" "}
                        {pagination.totalItems === 1
                          ? "resultado"
                          : "resultados"}
                      </>
                    ) : (
                      "0 resultados"
                    )}
                  </span>

                  {/* Controles */}
                  <div className="flex items-center gap-2">
                    {/* Previous */}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goToPreviousPage}
                      disabled={!pagination?.hasPreviousPage || loading}
                    >
                      <ChevronLeft size={16} />
                    </Button>

                    {/* Números de página */}
                    {pagination &&
                      getPageNumbers(pagination).map((page, index) =>
                        page === "..." ? (
                          <span key={`ellipsis-${index}`} className="px-2">
                            ...
                          </span>
                        ) : (
                          <Button
                            key={page}
                            variant={
                              pagination.currentPage === page
                                ? "default"
                                : "outline"
                            }
                            size="icon"
                            onClick={() => goToPage(page as number)}
                            disabled={loading}
                          >
                            {page}
                          </Button>
                        ),
                      )}

                    {/* Next */}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goToNextPage}
                      disabled={!pagination?.hasNextPage || loading}
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

#### 4. **Função Helper para Números de Página**

```tsx
// utils/pagination.ts
export function getPageNumbers(
  pagination: PaginationInfo,
): (number | string)[] {
  const { currentPage, totalPages } = pagination;
  const pages: (number | string)[] = [];
  const maxPagesToShow = 5;

  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
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
}
```

---

## 🎯 Comportamento

### Ao Clicar em "Próxima Página":

1. `currentPage` muda de 1 para 2
2. Apollo Client detecta mudança nas variáveis
3. Faz nova requisição: `GET_TRANSACTIONS_PAGINATED(page: 2, limit: 10)`
4. Backend retorna transações 11-20
5. UI atualiza automaticamente

### Ao Aplicar Filtros:

1. Usuário digita no campo de busca
2. `filters.title` atualiza
3. Página reseta para 1
4. Apollo faz requisição com filtros: `GET_TRANSACTIONS_PAGINATED(page: 1, limit: 10, filters: { title: "compra" })`
5. Backend filtra e retorna resultados

---

## 🚀 Otimizações

### 1. **Debounce no Campo de Busca**

```tsx
import { useDebounce } from "@/hooks/use-debounce";

function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data } = useQuery(GET_TRANSACTIONS_PAGINATED, {
    variables: {
      filters: {
        title: debouncedSearch || undefined,
      },
    },
  });
}
```

### 2. **Loading State Melhorado**

```tsx
{
  loading && currentPage === 1 ? (
    // Skeleton loaders na primeira carga
    <SkeletonRows count={10} />
  ) : loading ? (
    // Spinner ao navegar entre páginas
    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
      <Spinner />
    </div>
  ) : (
    // Dados
    <TransactionRows />
  );
}
```

### 3. **Cache Strategy**

```tsx
const { data } = useQuery(GET_TRANSACTIONS_PAGINATED, {
  variables: { page, limit, filters },
  fetchPolicy: "cache-and-network", // Mostra cache enquanto busca novos dados
  nextFetchPolicy: "cache-first", // Usa cache em buscas subsequentes
});
```

---

## 📊 Comparação Final

| Aspecto                     | Client-Side               | Server-Side              |
| --------------------------- | ------------------------- | ------------------------ |
| **Requisições HTTP**        | 1 vez (inicial)           | A cada mudança de página |
| **Dados carregados**        | Todos                     | Apenas 10 por vez        |
| **Velocidade de navegação** | ⚡ Instantânea            | 🔄 Depende da rede       |
| **Memória usada**           | Alta (todos os dados)     | Baixa (só página atual)  |
| **Escalabilidade**          | ❌ Ruim (>1000 registros) | ✅ Excelente (milhões)   |
| **Complexidade**            | 🟢 Simples                | 🟡 Média                 |
| **Backend required**        | Não                       | Sim                      |

---

## 🎯 Quando Usar Server-Side?

✅ **Use quando:**

- Você tem +1000 registros
- Dados mudam frequentemente
- Performance é crítica
- Você quer economizar banda
- Backend já existe

✅ **É a escolha CERTA para aplicações em produção escaláveis!**

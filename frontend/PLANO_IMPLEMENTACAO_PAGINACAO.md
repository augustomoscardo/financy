# 📋 Plano de Ação: Implementação de Paginação Server-Side

## 🎯 Objetivo

Implementar paginação server-side completa para transações, permitindo carregar apenas 10 itens por página e evitar lentidão com grandes volumes de dados.

---

## 📊 Visão Geral

### Escopo

- ✅ Paginação de transações (10 por página)
- ✅ Filtros (título, tipo, categoria, período)
- ✅ Contadores (total de itens, páginas)
- ✅ Navegação (anterior, próxima, ir para página)

### Tempo Estimado

**Total: 2-3 horas**

- Backend: 1-1.5h
- Frontend: 1-1.5h

---

## 🔧 FASE 1: Backend (GraphQL + Prisma)

### ✅ **Passo 1.1: Atualizar Schema GraphQL** (15 min)

**Arquivo:** `backend/src/schema.graphql`

```graphql
# Adicionar novos tipos

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

# Adicionar nova query (manter a antiga por compatibilidade)
extend type Query {
  getTransactionsPaginated(
    page: Int = 1
    limit: Int = 10
    filters: TransactionFilters
  ): TransactionConnection!
}
```

**Checklist:**

- [ ] Adicionar tipos PaginationInfo e TransactionConnection
- [ ] Adicionar input TransactionFilters
- [ ] Adicionar query getTransactionsPaginated
- [ ] Manter query getTransactions existente (não quebrar)

---

### ✅ **Passo 1.2: Criar/Atualizar Resolver** (30 min)

**Arquivo:** `backend/src/modules/transaction/transaction.resolver.ts`

```typescript
import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "@/auth/guards/gql-auth.guard";
import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import { TransactionService } from "./transaction.service";
import {
  TransactionConnection,
  TransactionFilters,
} from "./dto/transaction.dto";

@Resolver("Transaction")
@UseGuards(GqlAuthGuard)
export class TransactionResolver {
  constructor(private transactionService: TransactionService) {}

  @Query(() => TransactionConnection)
  async getTransactionsPaginated(
    @Args("page", { type: () => Int, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Int, defaultValue: 10 }) limit: number,
    @Args("filters", { nullable: true }) filters: TransactionFilters,
    @CurrentUser() user: any,
  ): Promise<TransactionConnection> {
    return this.transactionService.getTransactionsPaginated(
      user.id,
      page,
      limit,
      filters,
    );
  }
}
```

**Checklist:**

- [ ] Adicionar método getTransactionsPaginated no resolver
- [ ] Validar autenticação com GqlAuthGuard
- [ ] Passar userId do usuário logado
- [ ] Retornar TransactionConnection

---

### ✅ **Passo 1.3: Implementar Service** (45 min)

**Arquivo:** `backend/src/modules/transaction/transaction.service.ts`

```typescript
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import {
  TransactionConnection,
  TransactionFilters,
} from "./dto/transaction.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async getTransactionsPaginated(
    userId: string,
    page: number,
    limit: number,
    filters?: TransactionFilters,
  ): Promise<TransactionConnection> {
    // 1. Validar e normalizar inputs
    const validPage = Math.max(1, page);
    const validLimit = Math.min(100, Math.max(1, limit)); // Máx 100 por página
    const skip = (validPage - 1) * validLimit;

    // 2. Construir where clause com filtros
    const where: Prisma.TransactionWhereInput = {
      userId,
    };

    if (filters?.title) {
      where.title = {
        contains: filters.title,
        mode: "insensitive",
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

    // 3. Executar queries em paralelo (otimização)
    const [transactions, totalItems] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: validLimit,
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    // 4. Calcular metadados de paginação
    const totalPages = Math.ceil(totalItems / validLimit);
    const hasNextPage = validPage < totalPages;
    const hasPreviousPage = validPage > 1;

    // 5. Retornar resultado estruturado
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

**Checklist:**

- [ ] Validar page e limit (evitar valores inválidos)
- [ ] Construir filtros dinamicamente
- [ ] Usar Promise.all para otimização
- [ ] Calcular metadados de paginação
- [ ] Incluir category no resultado
- [ ] Ordenar por data (mais recentes primeiro)

---

### ✅ **Passo 1.4: Criar DTOs** (15 min)

**Arquivo:** `backend/src/modules/transaction/dto/transaction.dto.ts`

```typescript
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { TransactionType } from "@prisma/client";

@InputType()
export class TransactionFilters {
  @Field({ nullable: true })
  title?: string;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field({ nullable: true })
  categoryId?: string;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;
}

@ObjectType()
export class PaginationInfo {
  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  itemsPerPage: number;

  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;
}

@ObjectType()
export class TransactionConnection {
  @Field(() => [Transaction])
  transactions: Transaction[];

  @Field(() => PaginationInfo)
  pagination: PaginationInfo;
}
```

**Checklist:**

- [ ] Criar InputType para filtros
- [ ] Criar ObjectType para PaginationInfo
- [ ] Criar ObjectType para TransactionConnection
- [ ] Decorar campos com @Field apropriadamente

---

### ✅ **Passo 1.5: Testar Backend** (15 min)

**Usar GraphQL Playground:**

```graphql
# Teste 1: Buscar primeira página
query {
  getTransactionsPaginated(page: 1, limit: 10) {
    transactions {
      id
      title
      amount
      type
      category {
        name
      }
    }
    pagination {
      currentPage
      totalPages
      totalItems
      hasNextPage
      hasPreviousPage
    }
  }
}

# Teste 2: Com filtros
query {
  getTransactionsPaginated(
    page: 1
    limit: 10
    filters: { title: "compra", type: EXPENSE }
  ) {
    transactions {
      id
      title
    }
    pagination {
      totalItems
    }
  }
}

# Teste 3: Página 2
query {
  getTransactionsPaginated(page: 2, limit: 10) {
    transactions {
      id
      title
    }
    pagination {
      currentPage
      hasPreviousPage
      hasNextPage
    }
  }
}
```

**Checklist:**

- [ ] Query sem filtros funciona
- [ ] Query com filtros funciona
- [ ] Paginação calcula corretamente
- [ ] hasNextPage e hasPreviousPage corretos
- [ ] Performance aceitável (<500ms)

---

## 🎨 FASE 2: Frontend (React + Apollo Client)

### ✅ **Passo 2.1: Atualizar GraphQL Query** (10 min)

**Arquivo:** `frontend/src/lib/graphql/queries/transaction.ts`

```typescript
import { gql } from "@apollo/client";

// Manter query antiga
export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    getTransactions {
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
  }
`;

// Nova query paginada
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

**Checklist:**

- [ ] Adicionar GET_TRANSACTIONS_PAGINATED
- [ ] Incluir todos os campos necessários
- [ ] Adicionar variáveis (page, limit, filters)

---

### ✅ **Passo 2.2: Atualizar Types** (10 min)

**Arquivo:** `frontend/src/types/index.ts`

```typescript
// Adicionar ao arquivo existente

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

**Checklist:**

- [ ] Adicionar interfaces de paginação
- [ ] Não quebrar types existentes

---

### ✅ **Passo 2.3: Criar Hook Customizado** (20 min) - OPCIONAL

**Arquivo:** `frontend/src/hooks/use-transactions-paginated.ts`

```typescript
import { useState, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { GET_TRANSACTIONS_PAGINATED } from "@/lib/graphql/queries/transaction";
import type { TransactionConnection, TransactionFilters } from "@/types";

export function useTransactionsPaginated(initialFilters?: TransactionFilters) {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TransactionFilters | undefined>(
    initialFilters,
  );
  const limit = 10;

  const { data, loading, error, refetch } = useQuery<{
    getTransactionsPaginated: TransactionConnection;
  }>(GET_TRANSACTIONS_PAGINATED, {
    variables: {
      page,
      limit,
      filters: filters || {},
    },
    fetchPolicy: "cache-and-network",
  });

  const transactions = data?.getTransactionsPaginated.transactions || [];
  const pagination = data?.getTransactionsPaginated.pagination;

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const nextPage = useCallback(() => {
    if (pagination?.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  }, [pagination]);

  const previousPage = useCallback(() => {
    if (pagination?.hasPreviousPage) {
      setPage((prev) => prev - 1);
    }
  }, [pagination]);

  const updateFilters = useCallback((newFilters: TransactionFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset para primeira página
  }, []);

  return {
    transactions,
    pagination,
    loading,
    error,
    page,
    goToPage,
    nextPage,
    previousPage,
    updateFilters,
    refetch,
  };
}
```

**Checklist:**

- [ ] Hook encapsula lógica de paginação
- [ ] Reset para página 1 ao mudar filtros
- [ ] Expõe funções de navegação

---

### ✅ **Passo 2.4: Atualizar Componente de Transações** (40 min)

**Arquivo:** `frontend/src/pages/transactions/index.tsx`

Ver implementação completa em [PAGINACAO_SERVER_SIDE.md](PAGINACAO_SERVER_SIDE.md)

**Principais mudanças:**

```typescript
// ANTES (client-side)
const { data } = useQuery(GET_TRANSACTIONS);
const allTransactions = data?.getTransactions || [];
const filteredTransactions = useMemo(() => filter(allTransactions), []);
const currentTransactions = filteredTransactions.slice(start, end);

// DEPOIS (server-side)
const { data } = useQuery(GET_TRANSACTIONS_PAGINATED, {
  variables: { page: currentPage, limit: 10, filters },
});
const transactions = data?.getTransactionsPaginated.transactions || [];
const pagination = data?.getTransactionsPaginated.pagination;
```

**Checklist:**

- [ ] Trocar GET_TRANSACTIONS por GET_TRANSACTIONS_PAGINATED
- [ ] Passar variáveis (page, limit, filters)
- [ ] Usar pagination do backend
- [ ] Atualizar UI com metadados corretos
- [ ] Implementar navegação (anterior/próxima)
- [ ] Reset página ao mudar filtros

---

### ✅ **Passo 2.5: Criar Utility para Páginas** (10 min)

**Arquivo:** `frontend/src/lib/pagination-utils.ts`

```typescript
import type { PaginationInfo } from "@/types";

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
    return pages;
  }

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

  return pages;
}

export function getPaginationRange(pagination: PaginationInfo): string {
  const { currentPage, itemsPerPage, totalItems } = pagination;

  if (totalItems === 0) return "0";

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return `${start} a ${end}`;
}
```

**Checklist:**

- [ ] Função para gerar números de página com "..."
- [ ] Função para calcular range (ex: "1 a 10")
- [ ] Testar casos edge (0 items, 1 página, etc)

---

### ✅ **Passo 2.6: Adicionar Debounce no Search** (15 min)

**Arquivo:** `frontend/src/hooks/use-debounce.ts`

```typescript
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

**Uso no componente:**

```typescript
const [searchTerm, setSearchTerm] = useState("");
const debouncedSearch = useDebounce(searchTerm, 500);

// Usar debouncedSearch nos filtros
const { data } = useQuery(GET_TRANSACTIONS_PAGINATED, {
  variables: {
    filters: {
      title: debouncedSearch || undefined,
    },
  },
});
```

**Checklist:**

- [ ] Criar hook useDebounce
- [ ] Aplicar no campo de busca
- [ ] Testar delay (500ms ideal)

---

## 🧪 FASE 3: Testes e Validação

### ✅ **Passo 3.1: Testes Funcionais** (20 min)

**Cenários de teste:**

1. **Navegação básica**
   - [ ] Página 1 carrega 10 transações
   - [ ] Botão "Próxima" leva para página 2
   - [ ] Botão "Anterior" volta para página 1
   - [ ] Clicar em número leva para página correta

2. **Filtros**
   - [ ] Buscar por título funciona
   - [ ] Filtrar por tipo funciona
   - [ ] Filtrar por categoria funciona
   - [ ] Múltiplos filtros juntos funcionam
   - [ ] Limpar filtros funciona

3. **Contadores**
   - [ ] Total de itens correto
   - [ ] Range correto (ex: "11 a 20")
   - [ ] Total de páginas correto

4. **Edge cases**
   - [ ] 0 transações (mensagem apropriada)
   - [ ] 1 transação (sem erros)
   - [ ] Última página com menos de 10 items
   - [ ] Filtro sem resultados

---

### ✅ **Passo 3.2: Testes de Performance** (15 min)

**Usar Chrome DevTools:**

1. **Network tab**
   - [ ] Payload pequeno (apenas 10 transações)
   - [ ] Tempo de resposta < 500ms
   - [ ] Não carrega dados duplicados

2. **Performance tab**
   - [ ] Sem re-renders desnecessários
   - [ ] Smooth scroll/navegação

3. **Simular dados grandes**
   ```sql
   -- Criar 10.000 transações de teste
   INSERT INTO transactions (/* ... */)
   VALUES /* ... */
   ```

   - [ ] Interface permanece responsiva
   - [ ] Tempo de carga consistente

---

## 📝 FASE 4: Documentação e Finalização

### ✅ **Passo 4.1: Documentar** (10 min)

- [ ] Atualizar README com nova query
- [ ] Documentar filtros disponíveis
- [ ] Adicionar exemplos de uso

### ✅ **Passo 4.2: Cleanup** (10 min)

- [ ] Remover console.logs
- [ ] Remover código comentado
- [ ] Verificar imports não usados

### ✅ **Passo 4.3: Deploy** (variável)

- [ ] Merge para branch de desenvolvimento
- [ ] Testar em staging
- [ ] Deploy para produção
- [ ] Monitorar logs/erros

---

## 🎯 Checklist Final

**Backend:**

- [ ] Schema GraphQL atualizado
- [ ] Resolver implementado
- [ ] Service com lógica de paginação
- [ ] DTOs criados
- [ ] Testes passando

**Frontend:**

- [ ] Query GraphQL atualizada
- [ ] Types criados
- [ ] Componente atualizado
- [ ] Navegação funcionando
- [ ] Filtros funcionando
- [ ] UI responsiva

**Quality:**

- [ ] Performance testada
- [ ] Edge cases cobertos
- [ ] Código revisado
- [ ] Documentação atualizada

---

## 🚀 Próximos Passos (Melhorias Futuras)

1. **Cache strategy melhorada**
   - Implementar cache do Apollo Client
   - Prefetch da próxima página

2. **Loading states melhores**
   - Skeleton loaders
   - Optimistic UI

3. **Infinite scroll** (alternativa)
   - Load more ao invés de páginas
   - Melhor UX mobile

4. **Analytics**
   - Trackear páginas mais visitadas
   - Filtros mais usados

---

## 📞 Suporte

**Problemas comuns:**

| Problema                | Solução                                   |
| ----------------------- | ----------------------------------------- |
| Query não retorna dados | Verificar autenticação e userId           |
| Performance lenta       | Adicionar índices no banco (userId, date) |
| Filtros não funcionam   | Verificar tipos no GraphQL schema         |
| Paginação incorreta     | Validar cálculo de skip/take              |

**Dúvidas?** Consulte [EXPLICACAO_TECNICA_PAGINACAO.md](EXPLICACAO_TECNICA_PAGINACAO.md)

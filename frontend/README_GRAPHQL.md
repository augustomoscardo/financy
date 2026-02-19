# Estrutura GraphQL - Financy Frontend

## 📁 Estrutura de Arquivos

```
src/
├── lib/
│   └── graphql/
│       ├── index.ts                          (export central)
│       ├── EXAMPLES.md                       (exemplos de uso)
│       ├── mutations/
│       │   ├── create-category.ts            ✅ Criar categoria
│       │   ├── update-category.ts            ✅ Atualizar categoria
│       │   ├── delete-category.ts            ✅ Deletar categoria
│       │   ├── create-transaction.ts         ✅ Criar transação
│       │   ├── update-transaction.ts         ✅ Atualizar transação
│       │   └── delete-transaction.ts         ✅ Deletar transação
│       └── queries/
│           ├── get-categories.ts             ✅ Buscar categorias
│           └── get-transactions.ts           ✅ Buscar transações
├── hooks/
│   ├── use-category.ts                       ✅ Hooks para categorias
│   ├── use-transaction.ts                    ✅ Hooks para transações
│   └── use-dialog.ts                         (existente)
├── types/
│   └── index.ts                              ✅ Types atualizados
└── components/
    └── new-category-modal.tsx                ✅ Atualizado com mutation
```

## 🎯 Mutations Disponíveis

### Categories

- `CREATE_CATEGORY` - Criar nova categoria
- `UPDATE_CATEGORY` - Atualizar categoria existente
- `DELETE_CATEGORY` - Deletar categoria

### Transactions

- `CREATE_TRANSACTION` - Criar nova transação
- `UPDATE_TRANSACTION` - Atualizar transação existente
- `DELETE_TRANSACTION` - Deletar transação

## 📊 Queries Disponíveis

### Categories

- `GET_CATEGORIES` - Buscar todas as categorias do usuário

### Transactions

- `GET_TRANSACTIONS` - Buscar todas as transações do usuário

## 🪝 Hooks Customizados

### Categorias (`use-category.ts`)

```tsx
const { execute, loading, error } = useCreateCategory();
const { execute, loading, error } = useUpdateCategory();
const { execute, loading, error } = useDeleteCategory();
const { categories, loading, error, refetch } = useGetCategories();
```

### Transações (`use-transaction.ts`)

```tsx
const { execute, loading, error } = useCreateTransaction();
const { execute, loading, error } = useUpdateTransaction();
const { execute, loading, error } = useDeleteTransaction();
const { transactions, loading, error, refetch } = useGetTransactions();
```

## 💡 Exemplo Rápido

### Criar Categoria

```tsx
import { useCreateCategory } from "@/hooks/use-category";
import { toast } from "sonner";

function CreateCategoryButton() {
  const { execute, loading } = useCreateCategory();

  const handleCreate = async () => {
    try {
      await execute({
        name: "Alimentação",
        description: "Despesas com comida",
        icon: "utensils",
        color: "green",
      });
      toast.success("Categoria criada!");
    } catch (error) {
      toast.error("Erro ao criar categoria");
    }
  };

  return (
    <button onClick={handleCreate} disabled={loading}>
      {loading ? "Criando..." : "Criar Categoria"}
    </button>
  );
}
```

### Listar Transações

```tsx
import { useGetTransactions } from "@/hooks/use-transaction";

function TransactionsList() {
  const { transactions, loading, error } = useGetTransactions();

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar</div>;

  return (
    <div>
      {transactions?.map((t) => (
        <div key={t.id}>
          <h3>{t.title}</h3>
          <p>R$ {t.amount}</p>
          <p>{t.category.name}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🔄 Recursos

- ✅ Refetch automático após mutations
- ✅ Tratamento de erros integrado
- ✅ Loading states
- ✅ Toast notifications
- ✅ Types completamente tipados
- ✅ Hooks reutilizáveis

## 📝 Dados Esperados

### Category Input

```json
{
  "name": "Finanças",
  "description": "Teste",
  "icon": "shopping-cart",
  "color": "purple"
}
```

### Transaction Input

```json
{
  "title": "Compra no mercado",
  "description": "Compra semanal",
  "amount": 150.5,
  "type": "outcome",
  "categoryId": "uuid",
  "date": "2026-01-28T10:00:00Z"
}
```

## 🚀 Próximos Passos

1. Implementar as pages com os dados
2. Adicionar filtros e paginação nas queries (se necessário)
3. Implementar cache strategy do Apollo Client
4. Adicionar mais validações nos inputs

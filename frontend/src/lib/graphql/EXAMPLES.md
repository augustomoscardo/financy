/\*\*

- EXEMPLOS DE USO DOS HOOKS
-
- Este arquivo documenta como usar os hooks criados para mutations e queries
  \*/

// ===== CATEGORIES =====

// 1. Buscar categorias
import { useGetCategories } from '@/hooks/use-category'

function CategoriesList() {
const { categories, loading, error } = useGetCategories()

if (loading) return <div>Carregando...</div>
if (error) return <div>Erro ao carregar categorias</div>

return (
<div>
{categories?.map(category => (
<div key={category.id}>{category.name}</div>
))}
</div>
)
}

// 2. Criar categoria
import { useCreateCategory } from '@/hooks/use-category'
import { toast } from 'sonner'

function CreateCategoryForm() {
const { execute: createCategory, loading } = useCreateCategory()

const handleSubmit = async (formData: any) => {
try {
await createCategory({
name: formData.title,
description: formData.description,
icon: formData.icon,
color: formData.color
})
toast.success('Categoria criada!')
} catch (error) {
toast.error('Erro ao criar categoria')
}
}

return (
<form onSubmit={(e) => {
e.preventDefault()
handleSubmit({ title: 'Test', icon: 'shopping-cart', color: 'purple' })
}}>
<button disabled={loading}>{loading ? 'Salvando...' : 'Criar'}</button>
</form>
)
}

// 3. Atualizar categoria
import { useUpdateCategory } from '@/hooks/use-category'

function UpdateCategoryForm() {
const { execute: updateCategory, loading } = useUpdateCategory()

const handleUpdate = async (categoryId: string) => {
try {
await updateCategory(categoryId, {
name: 'Novo Nome',
color: 'blue'
})
toast.success('Categoria atualizada!')
} catch (error) {
toast.error('Erro ao atualizar categoria')
}
}

return (
<button onClick={() => handleUpdate('category-id')} disabled={loading}>
{loading ? 'Atualizando...' : 'Atualizar'}
</button>
)
}

// 4. Deletar categoria
import { useDeleteCategory } from '@/hooks/use-category'

function DeleteCategoryButton() {
const { execute: deleteCategory, loading } = useDeleteCategory()

const handleDelete = async (categoryId: string) => {
if (confirm('Tem certeza que deseja deletar?')) {
try {
await deleteCategory(categoryId)
toast.success('Categoria deletada!')
} catch (error) {
toast.error('Erro ao deletar categoria')
}
}
}

return (
<button onClick={() => handleDelete('category-id')} disabled={loading}>
{loading ? 'Deletando...' : 'Deletar'}
</button>
)
}

// ===== TRANSACTIONS =====

// 5. Buscar transações
import { useGetTransactions } from '@/hooks/use-transaction'

function TransactionsList() {
const { transactions, loading, error } = useGetTransactions()

if (loading) return <div>Carregando...</div>
if (error) return <div>Erro ao carregar transações</div>

return (
<div>
{transactions?.map(transaction => (
<div key={transaction.id}>
<h3>{transaction.title}</h3>
<p>R$ {transaction.amount}</p>
<p>{transaction.category?.name}</p>
</div>
))}
</div>
)
}

// 6. Criar transação
import { useCreateTransaction } from '@/hooks/use-transaction'
import { TransactionType } from '@/types'

function CreateTransactionForm() {
const { execute: createTransaction, loading } = useCreateTransaction()

const handleSubmit = async (formData: any) => {
try {
await createTransaction({
title: formData.title,
description: formData.description,
amount: parseFloat(formData.amount),
type: formData.type,
categoryId: formData.categoryId,
date: formData.date || new Date().toISOString()
})
toast.success('Transação criada!')
} catch (error) {
toast.error('Erro ao criar transação')
}
}

return (
<form onSubmit={(e) => {
e.preventDefault()
handleSubmit({
title: 'Compra',
amount: 100,
type: TransactionType.outcome,
categoryId: 'cat-id'
})
}}>
<button disabled={loading}>{loading ? 'Salvando...' : 'Criar'}</button>
</form>
)
}

// 7. Atualizar transação
import { useUpdateTransaction } from '@/hooks/use-transaction'

function UpdateTransactionForm() {
const { execute: updateTransaction, loading } = useUpdateTransaction()

const handleUpdate = async (transactionId: string) => {
try {
await updateTransaction(transactionId, {
title: 'Novo Título',
amount: 250
})
toast.success('Transação atualizada!')
} catch (error) {
toast.error('Erro ao atualizar transação')
}
}

return (
<button onClick={() => handleUpdate('transaction-id')} disabled={loading}>
{loading ? 'Atualizando...' : 'Atualizar'}
</button>
)
}

// 8. Deletar transação
import { useDeleteTransaction } from '@/hooks/use-transaction'

function DeleteTransactionButton() {
const { execute: deleteTransaction, loading } = useDeleteTransaction()

const handleDelete = async (transactionId: string) => {
if (confirm('Tem certeza que deseja deletar?')) {
try {
await deleteTransaction(transactionId)
toast.success('Transação deletada!')
} catch (error) {
toast.error('Erro ao deletar transação')
}
}
}

return (
<button onClick={() => handleDelete('transaction-id')} disabled={loading}>
{loading ? 'Deletando...' : 'Deletar'}
</button>
)
}

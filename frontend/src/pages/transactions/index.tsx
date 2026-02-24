import { Page } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, CircleArrowDown, CircleArrowUp, Plus, Search, SquarePen, Trash } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useDialog } from "@/hooks/use-dialog";
import { ModalNewTransaction } from "@/components/new-transaction-modal";
import { useQuery } from "@apollo/client/react";
import { GET_TRANSACTIONS_PAGINATED } from "@/lib/graphql/queries/transaction";
import type { Category, Transaction, TransactionConnection, TransactionFilters, TransactionType } from "@/types";
import { DynamicIcon } from "lucide-react/dynamic";
import { useMemo, useState } from "react";
import { DeleteTransactionModal } from "@/components/delete-transaction-modal";
import { UpdateTransactionModal } from "@/components/update-transaction-modal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useDebounce } from "@/hooks/use-debounce";
import { getPageNumbers, getPaginationRange } from "@/lib/pagination-utils";
import { getCategoryColor } from "@/lib/category-utils";

export function Transactions() {
  const form = useForm({
    defaultValues: {
      title: "",
      type: "all",
      category: "all",
      period: "all",
    },
  })

  const newTransactionDialog = useDialog();
  const updateTransactionDialog = useDialog();
  const deleteTransactionDialog = useDialog();

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10

  const titleFilter = useWatch({ control: form.control, name: "title" })
  const typeFilter = useWatch({ control: form.control, name: "type" })
  const categoryFilter = useWatch({ control: form.control, name: "category" })
  const periodFilter = useWatch({ control: form.control, name: "period" })

  const debouncedTitle = useDebounce(titleFilter, 500)

  const filters = useMemo<TransactionFilters>(() => {
    return {
      type: typeFilter === "all" ? undefined : (typeFilter as TransactionType),
    }
  }, [typeFilter])

  const { data, loading, refetch } = useQuery<{ getTransactionsPaginated: TransactionConnection }>(GET_TRANSACTIONS_PAGINATED, {
    variables: {
      page: currentPage,
      limit,
      filters,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  })

  const transactions = useMemo(() => data?.getTransactionsPaginated.transactions ?? [], [data])
  const pagination = data?.getTransactionsPaginated.pagination

  const { filteredTransactions, transactionsCategories, transactionsPeriods } = useMemo(() => {
    const normalizedTitle = debouncedTitle?.trim().toLowerCase()
    const filtered: Transaction[] = []
    const periods: string[] = []
    const categories: Category[] = []

    for (const transaction of transactions) {
      const transactionDate = new Date(transaction.date)
      const transactionPeriod = format(transactionDate, "yyyy-MM")
      const transactionCategoryId = transaction.category.id

      if (!periods.includes(transactionPeriod)) {
        periods.push(transactionPeriod)
      }

      if (!categories.find((category) => category.id === transactionCategoryId)) {
        categories.push(transaction.category)
      }

      const matchesTitle = !normalizedTitle
        || transaction.title.toLowerCase().includes(normalizedTitle)

      const matchesPeriod = periodFilter === "all"
        || format(new Date(transaction.date), "yyyy-MM") === periodFilter

      const matchesCategory = categoryFilter === "all"
        || transaction.category.id === categoryFilter

      if (!matchesTitle || !matchesPeriod || !matchesCategory) {
        continue
      }

      filtered.push(transaction)
    }

    periods.sort((firstPeriod, secondPeriod) => secondPeriod.localeCompare(firstPeriod))

    return {
      filteredTransactions: filtered,
      transactionsCategories: categories,
      transactionsPeriods: periods,
    }
  }, [categoryFilter, debouncedTitle, periodFilter, transactions])

  const pageNumbers = useMemo(() => {
    if (!pagination) {
      return []
    }

    return getPageNumbers(pagination)
  }, [pagination])

  function handleOpenDeleteTransactionDialog(transaction: Transaction) {
    setSelectedTransaction(transaction)
    deleteTransactionDialog.onOpenChange(true)
  }

  function handleOpenUpdateTransactionDialog(transaction: Transaction) {
    setSelectedTransaction(transaction)
    updateTransactionDialog.onOpenChange(true)
  }

  return (
    <Page className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[2px]">
          <h1 className="text-2xl font-bold text-gray-800">Transações</h1>
          <p className="text-base text-gray-600">Gerencie todas as suas transações financeiras.</p>
        </div>
        <Button
          className="flex items-center gap-2 bg-brand-base cursor-pointer text-white hover:bg-brand-dark "
          onClick={() => newTransactionDialog.onOpenChange(true)}>
          <Plus size={16} />
          Nova transação
        </Button>
      </div>

      <Card className="px-6 py-5 flex items-center gap-2">
        <Controller
          name="title"
          control={form.control}
          render={({ field }) => {
            return (
              <Field className="gap-2">
                <FieldLabel htmlFor={field.name} className="text-gray-700">
                  Buscar
                </FieldLabel>
                <div
                  className="flex items-center gap-3 border border-gray-300 rounded-md px-3 py-[14px] h-12"
                >
                  <Search size={16} className="text-gray-400" />
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Buscar por descrição"
                    className="border-none outline-none focus:ring-0 focus-visible:ring-0 p-0 shadow-none placeholder:text-gray-400 rounded-none"
                    onChange={field.onChange}
                  />
                </div>
              </Field>
            );
          }}
        />

        <Controller
          name="type"
          control={form.control}
          render={({ field }) => {
            return (
              <Field className="gap-2">
                <FieldLabel htmlFor={field.name} className="text-gray-700">
                  Tipo
                </FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    setCurrentPage(1)
                    field.onChange(value)
                  }}
                >
                  <SelectTrigger className="h-12 px-3 py-[14px]">
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="income">Entradas</SelectItem>
                      <SelectItem value="outcome">Saídas</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            );
          }}
        />

        <Controller
          name="category"
          control={form.control}
          render={({ field }) => {
            return (
              <Field className="gap-2">
                <FieldLabel htmlFor={field.name} className="text-gray-700">
                  Categoria
                </FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={loading}
                >
                  <SelectTrigger className="h-12 px-3 py-[14px]">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">Todas</SelectItem>
                      {transactionsCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            );
          }}
        />

        <Controller
          name="period"
          control={form.control}
          render={({ field }) => {
            return (
              <Field className="gap-2">
                <FieldLabel htmlFor={field.name} className="text-gray-700">
                  Período
                </FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="h-12 px-3 py-[14px]">
                    <SelectValue placeholder="Selecione um período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">Todas</SelectItem>
                      {transactionsPeriods.map((period) => (
                        <SelectItem key={period} value={period}>
                          {format(new Date(`${period}-01T00:00:00`), "MMMM / yyyy", { locale: ptBR })}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            );
          }}
        />
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-5 px-6 text-xs text-gray-500 tracking-wide font-medium uppercase bg-white">Descrição</TableHead>
              <TableHead className="py-5 px-6 text-xs text-gray-500 tracking-wide font-medium uppercase bg-white">Data</TableHead>
              <TableHead className="py-5 px-6 text-center text-xs text-gray-500 tracking-wide font-medium uppercase bg-white">Categoria</TableHead>
              <TableHead className="py-5 px-6 text-xs text-gray-500 tracking-wide font-medium uppercase bg-white">Tipo</TableHead>
              <TableHead className="py-5 px-6 text-right text-xs text-gray-500 tracking-wide font-medium uppercase bg-white">Valor</TableHead>
              <TableHead className="py-5 px-6 text-right text-xs text-gray-500 tracking-wide font-medium uppercase bg-white">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!loading && filteredTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-gray-500">
                  Nenhuma transação encontrada para os filtros selecionados.
                </TableCell>
              </TableRow>
            )}

            {filteredTransactions.length > 0 && filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="py-5 px-6">
                  <div className="flex items-center gap-4">
                    <Badge className={`p-3 ${getCategoryColor(transaction.category.color).lightBgClass} ${getCategoryColor(transaction.category.color).textClass}`}>
                      <DynamicIcon
                        name={transaction.category.icon as React.ComponentProps<typeof DynamicIcon>["name"]}
                      />
                    </Badge>
                    <span className="text-base text-gray-800 font-medium">{transaction.title}</span>
                  </div>
                </TableCell>

                <TableCell className="py-5 px-6 text-sm">{format(transaction.date as string, "dd/MM/yyyy")}</TableCell>

                <TableCell className="py-5 px-6 text-center">
                  <Badge className={`py-1 px-3 rounded-full ${getCategoryColor(transaction.category.color).lightBgClass} ${getCategoryColor(transaction.category.color).darkTextClass}`}>{transaction.category.name}</Badge>
                </TableCell>

                <TableCell>
                  {transaction.type === 'income' ? (
                    <div className="text-green-base flex items-center gap-2">
                      <CircleArrowUp size={16} />
                      Entrada
                    </div>
                  ) : (
                    <div className="text-red-base flex items-center gap-2">
                      <CircleArrowDown size={16} />
                      Saída
                    </div>
                  )}
                </TableCell>

                <TableCell className="py-5 px-6">
                  <div className="flex items-center justify-end">
                    <span className="text-sm text-gray-800 font-semibold">
                      {transaction.type === 'income'
                        ? `+ ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}`
                        : `- ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}`}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="py-5 px-6">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      className="text-danger bg-white border border-gray-300 rounded-lg w-8 h-8 hover:bg-gray-300"
                      onClick={() => handleOpenDeleteTransactionDialog(transaction)}
                    >
                      <Trash size={16} />
                    </Button>
                    <Button
                      className="text-gray-700 bg-white border border-gray-300 rounded-lg w-8 h-8 hover:bg-gray-300"
                      onClick={() => handleOpenUpdateTransactionDialog(transaction)}
                    >
                      <SquarePen size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="p-0 bg-white">
                <div className="py-5 px-6 flex items-center justify-between w-full">
                  <span className="text-gray-700 text-sm">
                    {pagination ? `${getPaginationRange(pagination)} | ${pagination.totalItems} resultados` : "0 | 0 resultados"}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={!pagination?.hasPreviousPage || loading}
                      onClick={() => setCurrentPage((previousPage) => Math.max(previousPage - 1, 1))}
                    >
                      <ChevronLeft size={16} />
                    </Button>

                    {pageNumbers.map((pageNumber, index) => {
                      if (pageNumber === "...") {
                        return (
                          <span key={`ellipsis-${index}`} className="h-8 min-w-8 px-2 inline-flex items-center justify-center text-gray-500 text-sm">
                            ...
                          </span>
                        )
                      }

                      const isCurrentPage = pageNumber === pagination?.currentPage

                      return (
                        <Button
                          key={pageNumber}
                          variant={isCurrentPage ? "default" : "outline"}
                          size="icon"
                          className={`h-8 w-8 ${isCurrentPage ? "bg-brand-base text-white hover:bg-brand-dark" : "text-gray-700"}`}
                          disabled={loading}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </Button>
                      )
                    })}

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={!pagination?.hasNextPage || loading}
                      onClick={() => setCurrentPage((previousPage) => previousPage + 1)}
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

      {newTransactionDialog.isOpen && (
        <ModalNewTransaction
          {...newTransactionDialog}
          onTransactionCreated={() => refetch()}
        />
      )}

      {selectedTransaction && deleteTransactionDialog.isOpen && (
        <DeleteTransactionModal
          {...deleteTransactionDialog}
          isOpen={deleteTransactionDialog.isOpen}
          transaction={selectedTransaction}
        />
      )}

      {selectedTransaction && updateTransactionDialog.isOpen && (
        <UpdateTransactionModal
          {...updateTransactionDialog}
          isOpen={updateTransactionDialog.isOpen}
          onOpenChange={updateTransactionDialog.onOpenChange}
          transaction={selectedTransaction}
        />
      )}
    </Page>
  )
}

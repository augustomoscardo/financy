import { Page } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, CircleArrowDown, CircleArrowUp, Plus, Search, SquarePen, Trash } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useDialog } from "@/hooks/use-dialog";
import { ModalNewTransaction } from "@/components/new-transaction-modal";
import { useQuery } from "@apollo/client/react";
import { GET_TRANSACTIONS } from "@/lib/graphql/queries/transaction";
import type { Category, Transaction } from "@/types";
import { DynamicIcon } from "lucide-react/dynamic";
import { useMemo, useState } from "react";
import { DeleteTransactionModal } from "@/components/delete-transaction-modal";
import { UpdateTransactionModal } from "@/components/update-transaction-modal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { normalizeStringRemovingAccents } from "@/utils/normalize-string-removing-accent";

export function Transactions() {
  const form = useForm({
    defaultValues: {
      title: "",
      type: "all",
      category: "all",
      period: "all",
    },
  })

  const filters = form.watch();

  const { data, loading } = useQuery<{ getTransactions: Transaction[] }>(GET_TRANSACTIONS)
  const transactions = data?.getTransactions || []

  const newTransactionDialog = useDialog();
  const updateTransactionDialog = useDialog();
  const deleteTransactionDialog = useDialog();

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  function handleOpenDeleteTransactionDialog(transaction: Transaction) {
    setSelectedTransaction(transaction)
    deleteTransactionDialog.onOpenChange(true)
  }

  function handleOpenUpdateTransactionDialog(transaction: Transaction) {
    setSelectedTransaction(transaction)
    updateTransactionDialog.onOpenChange(true)
  }

  const [transactionsCategories, transactionsPeriods] = useMemo(() => {
    const periods: string[] = []
    const categories: Category[] = []

    for (const transaction of transactions) {
      const transactionPeriod = format(new Date(transaction.date), "MMMM_yyyy").toLowerCase()
      const transactionCategoryId = transaction.category.id

      if (!periods.includes(transactionPeriod)) {
        periods.push(transactionPeriod)
      }

      if (!categories.find((category) => category.id === transactionCategoryId)) {
        categories.push(transaction.category)
      }
    }

    return [categories, periods]
  }, [transactions])


  const filteredTransactions = transactions.filter((transaction) => {
    const matchesTitle = normalizeStringRemovingAccents(transaction.title.toLowerCase()).includes(normalizeStringRemovingAccents(filters.title.toLowerCase()));

    const matchesType = filters.type === 'all' || transaction.type === filters.type;
    const matchesCategory = filters.category === 'all' || transaction.category.id === filters.category;
    const matchesPeriod = filters.period === 'all' || format(new Date(transaction.date), "MMMM_yyyy").toLowerCase() === filters.period

    return matchesTitle && matchesType && matchesCategory && matchesPeriod;
  })

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
                  className={`flex items-center gap-3 border border-gray-300 rounded-md px-3 py-[14px] h-12 `}
                >
                  <Search size={16} className="text-gray-400" />
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Buscar por descrição"
                    className="border-none outline-none focus:ring-0 focus-visible:ring-0 p-0 shadow-none placeholder:text-gray-400 rounded-none"
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
                <Select value={field.value} onValueChange={field.onChange}>
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
                <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-12 px-3 py-[14px]">
                    <SelectValue placeholder="Selecione um período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">Todas</SelectItem>
                      {transactionsPeriods.map((period) => (
                        <SelectItem key={period} value={period}>
                          {format(new Date(period), "MMMM / yyyy", { locale: ptBR })}
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
            {filteredTransactions.length > 0 && !loading && filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="py-5 px-6">
                  <div className="flex items-center gap-4">
                    <Badge className={`p-3 bg-${transaction.category.color}-light text-${transaction.category.color}-base`}>
                      <DynamicIcon name={transaction.category.icon as React.ComponentProps<typeof DynamicIcon>["name"]} />
                    </Badge>
                    <span className="text-base text-gray-800 font-medium">{transaction.title}</span>
                  </div>
                </TableCell>
                <TableCell className="py-5 px-6 text-sm">{format(transaction.date as string, "dd/MM/yyyy")}</TableCell>
                <TableCell className="py-5 px-6 text-center">
                  <Badge className={`py-1 px-3 bg-${transaction.category.color}-light text-${transaction.category.color}-dark rounded-full hover:bg-transparent`}>{transaction.category.name}</Badge>
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
                      {transaction.type === 'income' ?
                        `+ ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}`
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
                  <span className="text-gray-700 text-sm">1 a 10 | 27 resultados</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 text-gray-300">
                      <ChevronLeft size={16} />
                    </Button>
                    <Button variant="default" size="icon" className="h-8 w-8 bg-brand-base text-white">
                      1
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 text-gray-700">
                      2
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      3
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
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
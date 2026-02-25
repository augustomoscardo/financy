import { ModalNewTransaction } from "@/components/new-transaction-modal";
import { Page } from "@/components/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useDialog } from "@/hooks/use-dialog";
import { GET_CATEGORIES } from "@/lib/graphql/queries/category";
import { GET_TRANSACTIONS } from "@/lib/graphql/queries/transaction";
import { getCategoryColor } from "@/lib/category-utils";
import type { Category, Transaction } from "@/types";
import { useQuery } from "@apollo/client/react";
import { format } from "date-fns";
import { ChevronRight, CircleArrowDown, CircleArrowUp, Plus, Wallet } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { Link } from "react-router-dom";

export function Dashboard() {
  const { data: transactionsData, loading: transactionsLoading, refetch: refetchTransactions } = useQuery<{ getTransactions: Transaction[] }>(GET_TRANSACTIONS)
  const transactions = transactionsData?.getTransactions ? [...transactionsData.getTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : []

  const { data: categoriesData, loading: categoriesLoading, refetch: refetchCategories } = useQuery<{ getCategories: Category[] }>(GET_CATEGORIES)
  const categories = categoriesData?.getCategories || []

  const newTransactionDialog = useDialog();

  function handleOpenNewTransactionDialog() {
    newTransactionDialog.onOpenChange(true)
  }

  const summary = transactions.reduce((accumulator, current) => {
    if (current.type === "income") {
      accumulator.income += current.amount
    }

    if (current.type === "outcome") {
      accumulator.outcome += current.amount
    }

    accumulator.balance = accumulator.income - accumulator.outcome

    return accumulator
  }, {
    balance: 0,
    income: 0,
    outcome: 0,
  })

  return (
    <Page>
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          <Card className="p-6 flex flex-col gap-4 w-full">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-3">
                <Wallet size={20} className="text-purple-base" />
                <h3 className="text-gray-500 uppercase text-xs font-medium tracking-wide">Saldo Total</h3>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <span className="text-2xl sm:text-3xl text-gray-800 leading-8 font-bold break-all">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                }).format(summary.balance)}
              </span>
            </CardContent>
          </Card>
          <Card className="p-6 flex flex-col gap-4 w-full">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-3">
                <CircleArrowUp size={20} className="text-brand-base" />
                <h3 className="text-gray-500 uppercase text-xs font-medium tracking-wide">Receitas do Mês</h3>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <span className="text-2xl sm:text-3xl text-gray-800 leading-8 font-bold break-all">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                }).format(summary.income)}
              </span>
            </CardContent>
          </Card>
          <Card className="p-6 flex flex-col gap-4 w-full">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-3">
                <CircleArrowDown size={20} className="text-red-base" />
                <h3 className="text-gray-500 uppercase text-xs font-medium tracking-wide">Despesas do Mês</h3>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <span className="text-2xl sm:text-3xl text-gray-800 leading-8 font-bold break-all">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                }).format(summary.outcome)}
              </span>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 sm:gap-6">
          <Card className="lg:col-span-2 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between py-5 px-6">
              <h4 className="text-xs tracking-wide text-gray-500 uppercase font-medium">Transações Recentes</h4>
              <Link to="/transactions" className="text-sm leading-5 font-medium text-brand-base flex items-center gap-1 hover:underline hover:text-brand-dark">
                Ver todas
                <ChevronRight size={20} />
              </Link>
            </CardHeader>
            <Separator />
            <CardContent className="p-0 overflow-y-auto">{transactionsLoading && (
              <>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 sm:gap-12 py-4">
                    <div className="flex-1 flex items-center gap-4 px-6">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <div className="flex flex-col gap-2 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <div className="flex items-center gap-2 px-6">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="w-5 h-5 rounded" />
                    </div>
                  </div>
                ))}
              </>
            )}

              {!transactionsLoading && transactions.length > 0 && (
                <>
                  {transactions.map((transaction) => {
                    const categoryColor = getCategoryColor(transaction.category.color)

                    return (
                      <div key={transaction.id}>
                        <div className="flex flex-col items-start gap-3 py-4 sm:flex-row sm:items-center sm:gap-12">
                          <div className="w-full flex-1 flex items-center gap-4 px-6 ">
                            <Badge className={`p-3 rounded-lg ${categoryColor.lightBgClass}`}>
                              <DynamicIcon name={transaction.category.icon as React.ComponentProps<typeof DynamicIcon>["name"]} size={16} className={categoryColor.textClass} />
                            </Badge>
                            <div className="flex flex-col gap-1">
                              <p className="text-gray-800 font-medium leading-6">{transaction.title}</p>
                              <span className="text-gray-600 leading-5 text-sm">{format(new Date(transaction.date), "dd/MM/yyyy")}</span>
                            </div>
                          </div>
                          <Badge className={`${categoryColor.lightBgClass} ${categoryColor.darkTextClass} text-sm leading-5 font-medium rounded-full px-3 py-1 shadow-none ml-6 sm:ml-0`}>
                            {transaction.category.name}
                          </Badge>
                          <div className="flex items-center gap-2 px-6">
                            <p className="text-sm text-gray-800 font-semibold leading-5">
                              {transaction.type === 'income' ? '+ ' : '- '}
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              }).format(transaction.amount)}
                            </p>
                            {transaction.type === 'income' ? (
                              <CircleArrowUp className="text-brand-base" />
                            ) : (
                              <CircleArrowDown className="text-red-base" />
                            )}
                          </div>
                        </div>
                        <Separator />
                      </div>
                    )
                  })}
                </>
              )}

              {!transactionsLoading && !transactions.length && (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-gray-500">Não há transações registradas</p>
                </div>
              )}
            </CardContent>
            <Separator />
            <CardFooter className="flex items-center justify-center py-5 px-6 mt-auto">
              <Button
                variant="link"
                className="text-brand-base text-sm leading-5 font-medium hover:text-brand-dark hover:underline"
                onClick={handleOpenNewTransactionDialog}>
                <Plus size={20} />
                Nova transação
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col self-start min-w-96">
            <CardHeader className="flex flex-row items-center justify-between py-5 px-6">
              <h4 className="text-xs tracking-wide text-gray-500 uppercase font-medium">Categorias</h4>
              <Link to="/categories" className="text-sm leading-5 font-medium text-brand-base flex items-center gap-1 hover:underline hover:text-brand-dark">
                Gerenciar
                <ChevronRight size={20} />
              </Link>
            </CardHeader>
            <Separator />
            <CardContent className="p-6 flex flex-col gap-5 overflow-y-auto">
              {categoriesLoading && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <Skeleton className="w-24 h-7 rounded-full" />
                      <Skeleton className="flex-1 h-4 rounded" />
                      <Skeleton className="w-20 h-4 rounded" />
                    </div>
                  ))}
                </>
              )}

              {!categoriesLoading && categories.length > 0 && (
                categories.map((category) => {
                  const categoryColor = getCategoryColor(category.color)

                  return (
                    <div key={category.id} className="flex items-center gap-1">
                      <Badge className={`${categoryColor.lightBgClass} ${categoryColor.darkTextClass} text-sm leading-5 font-medium rounded-full px-3 py-1 shadow-none`}>
                        {category.name}
                      </Badge>
                      <span className="flex-1 text-end text-sm text-gray-600 leading-5">{category.countTransactions} itens</span>
                      {/* <p className="ml-4 text-sm text-gray-800 font-semibold leading-5">{new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(category.totalAmount)}
                    </p> */}
                    </div>
                  )
                })
              )}

              {!categoriesLoading && !categories.length && (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-gray-500">Não há categorias criadas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {newTransactionDialog.isOpen && (
        <ModalNewTransaction
          {...newTransactionDialog}
          onTransactionCreated={() => Promise.all([refetchTransactions(), refetchCategories()])}
        />
      )}
    </Page>
  )
}
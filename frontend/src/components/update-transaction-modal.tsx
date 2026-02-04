import type { DialogProps } from "@/hooks/use-dialog"
import { UPDATE_TRANSACTION } from "@/lib/graphql/mutations/transaction"
import { useMutation, useQuery } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { CircleArrowDown, CircleArrowUp, X } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { Field, FieldError, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { format } from 'date-fns'
import { Calendar } from "./ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import type { Category, Transaction } from "@/types"
import { GET_CATEGORIES } from "@/lib/graphql/queries/category"
import { toast } from "sonner"

type UpdateModalTransactionProps = {
  transaction: Transaction
} & DialogProps

const updateTransactionFormSchema = z.object({
  type: z.enum(['income', 'outcome']),
  title: z.string().min(1, "A descrição é obrigatória").min(3, "A descrição deve ter no mínimo 3 caracteres"),
  date: z.date({ error: "A data é obrigatória" }),
  amount: z.number({ error: "O valor é obrigatório" }).min(0.01, "O valor deve ser maior que zero"),
  category: z.string().min(1, "A categoria é obrigatória"),
})

type UpdateTransactionFormData = z.infer<typeof updateTransactionFormSchema>

function formatCurrency(value: string | number): string {
  const numValue = typeof value === 'string'
    ? parseFloat(value.replace(/\D/g, '')) / 100
    : value

  if (isNaN(numValue)) return 'R$ 0,00'

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numValue)
}

function parseCurrencyToNumber(value: string): number {
  return parseFloat(value.replace(/\D/g, '')) / 100
}

export function UpdateTransactionModal({ transaction, isOpen, onOpenChange }: UpdateModalTransactionProps) {
  const form = useForm<UpdateTransactionFormData>({
    resolver: zodResolver(updateTransactionFormSchema),
    defaultValues: {
      type: transaction.type,
      title: transaction.title,
      date: new Date(transaction.date),
      amount: transaction.amount,
      category: transaction.category.id,
    }
  })

  const [updateTransaction, { loading: updateTransactionLoading }] = useMutation(UPDATE_TRANSACTION)

  const { data, loading: categoriesLoading } = useQuery<{ getCategories: Category[] }>(GET_CATEGORIES)
  const categories = data?.getCategories || []
  console.log(transaction);

  async function handleUpdateTransaction(data: UpdateTransactionFormData) {
    try {
      await updateTransaction({
        variables: {
          id: transaction.id,
          data: {
            type: data.type,
            title: data.title,
            date: data.date,
            amount: data.amount,
            categoryId: data.category
          }
        }
      })
      toast.success("Transação atualizada com sucesso!")
      onOpenChange(false)
    } catch (error) {
      console.log(error)
      toast.error("Erro ao atualizar transação.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md flex flex-col gap-6' showCloseButton={false}>
        <DialogHeader className='flex flex-row justify-between'>
          <div className='flex flex-col gap-[2px]'>
            <DialogTitle className='text-base text-gray-800 font-semibold'>Editar Transação {transaction.title}</DialogTitle>
          </div>
          <Button
            variant="outline"
            className='p-2 border border-gray-300 rounded-lg m-0'
            onClick={() => onOpenChange(false)}
          >
            <X size={16} />
          </Button>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleUpdateTransaction)} className='flex flex-col gap-6'>
          <Controller
            name='type'
            control={form.control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className='flex items-center border border-gray-200 rounded-lg p-2'
              >
                <div className='flex items-center w-full'>
                  <RadioGroupItem
                    value="outcome"
                    id="outcome"
                    className='sr-only'
                  />
                  <Label
                    htmlFor="outcome"
                    className={`group flex items-center gap-3 rounded-lg border px-4 py-3 w-full cursor-pointer transition-all hover:bg-gray-100 hover:border-red-base ${field.value === 'outcome'
                      ? 'border-red-base bg-gray-100'
                      : 'border-transparent'
                      }`}
                  >
                    <CircleArrowDown
                      size={16}
                      className={`transition-colors group-hover:text-red-base ${field.value === 'outcome' ? 'text-red-base' : 'text-gray-400'
                        }`}
                    />
                    <span className={`font-medium transition-colors group-hover:text-gray-800 ${field.value === 'outcome' ? 'text-gray-800' : 'text-gray-600'
                      }`}>Despesa</span>
                  </Label>
                </div>
                <div className='flex items-center w-full'>
                  <RadioGroupItem
                    value="income"
                    id="income"
                    className='sr-only'
                  />
                  <Label
                    htmlFor="income"
                    className={`group flex items-center gap-3 rounded-lg border px-4 py-3 w-full cursor-pointer transition-all hover:bg-gray-100 hover:border-green-base ${field.value === 'income'
                      ? 'border-green-base bg-gray-100'
                      : 'border-transparent'
                      }`}
                  >
                    <CircleArrowUp
                      size={16}
                      className={`transition-colors group-hover:text-green-base ${field.value === 'income' ? 'text-green-base' : 'text-gray-400'
                        }`}
                    />
                    <span className={`font-medium transition-colors group-hover:text-gray-800 ${field.value === 'income' ? 'text-gray-800' : 'text-gray-600'
                      }`}>Receita</span>
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
          <Controller
            name='title'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={`flex flex-col gap-2`} >
                <FieldLabel htmlFor={field.name} className='active:bg-red-500'>Descrição</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  value={field.value}
                  placeholder='Ex. Almoço no restaurante'
                  className={`px-3 py-[14px] focus-visible:ring-0 placeholder:text-gray-400 ${fieldState.invalid ? 'border-red-500' : ''}`}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className='flex items-center gap-4'>
            <Controller
              name="date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Data</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date-picker-simple"
                        className="justify-start font-normal"
                      >
                        {field.value ? format(field.value, "dd/MM/yyyy") : <span>Selecione</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        defaultMonth={field.value}
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Valor</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder='R$ 0,00'
                    value={formatCurrency(field.value)}
                    onChange={(e) => {
                      const numValue = parseCurrencyToNumber(e.target.value)
                      field.onChange(numValue)
                    }}
                    className={`px-3 py-[14px] focus-visible:ring-0 placeholder:text-gray-400 ${fieldState.invalid ? 'border-red-500' : ''}`}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <Controller
            name='category'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={`flex flex-col gap-2`} >
                <FieldLabel htmlFor={field.name} className='active:bg-red-500'>Categoria</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={categoriesLoading || categories.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem value={category.id}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          <Button
            type='submit'
            className='bg-brand-base hover:bg-brand-dark cursor-pointer text-white font-medium py-3 h-12'
            disabled={updateTransactionLoading}
          >
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
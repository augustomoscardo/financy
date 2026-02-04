import { DialogProps } from '@/hooks/use-dialog'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { CircleArrowDown, CircleArrowUp, X } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldError, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Calendar } from './ui/calendar'
import { format } from 'date-fns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { CREATE_TRANSACTION } from '@/lib/graphql/mutations/transaction'
import { useMutation, useQuery } from '@apollo/client/react'
import { toast } from 'sonner'
import type { Category } from '@/types'
import { GET_CATEGORIES } from '@/lib/graphql/queries/category'
import { GET_TRANSACTIONS } from '@/lib/graphql/queries/transaction'

type ModalTransactionProps = DialogProps

const transactionFormSchema = z.object({
  type: z.enum(['income', 'outcome']),
  title: z.string().min(1, "A descrição é obrigatória").min(3, "A descrição deve ter no mínimo 3 caracteres"),
  date: z.date({ error: "A data é obrigatória" }),
  amount: z.number({ error: "O valor é obrigatório" }).min(0.01, "O valor deve ser maior que zero"),
  category: z.string().min(1, "A categoria é obrigatória"),
})

type TransactionFormData = z.infer<typeof transactionFormSchema>

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

function parseCurrency(value: string): number {
  const numValue = parseFloat(value.replace(/\D/g, '')) / 100

  return Number.isNaN(numValue) ? 0 : numValue
}

export function ModalNewTransaction(props: ModalTransactionProps) {
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: 'outcome',
      title: '',
      date: undefined,
      amount: 0,
      category: '',
    }
  })

  const { data, loading: categoriesLoading } = useQuery<{ getCategories: Category[] }>(GET_CATEGORIES)
  const categories = data?.getCategories || []

  const [newTransaction, { loading: newTransactionLoading }] = useMutation(CREATE_TRANSACTION)

  async function handleCreateTransaction(data: TransactionFormData) {
    try {
      await newTransaction({
        variables: {
          data: {
            type: data.type,
            title: data.title,
            date: new Date(data.date),
            amount: data.amount,
            categoryId: data.category
          }
        },
        refetchQueries: [{ query: GET_TRANSACTIONS }]
      })

      toast.success("Transação criada com sucesso!")
      props.onOpenChange(false)

    } catch (error: unknown) {
      toast.error("Erro ao criar transação.")
      console.log(error);
    }
  }

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
      <DialogContent className='max-w-md flex flex-col gap-6' showCloseButton={false}>
        <DialogHeader className='flex flex-row justify-between'>
          <div className='flex flex-col gap-[2px]'>
            <DialogTitle className='text-base text-gray-800 font-semibold'>Nova Transação</DialogTitle>
            <DialogDescription className='text-sm text-gray-600'>Registre sua despesa ou receita</DialogDescription>
          </div>
          <Button
            variant="outline"
            className='p-2 border border-gray-300 rounded-lg m-0'
            onClick={() => props.onOpenChange(false)}
          >
            <X size={16} />
          </Button>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleCreateTransaction)} className='flex flex-col gap-6'>
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
                    onChange={(event) => field.onChange(parseCurrency(event.target.value))}
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button
            type='submit'
            className='bg-brand-base hover:bg-brand-dark cursor-pointer text-white font-medium py-3 h-12'
            disabled={newTransactionLoading}
          >
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
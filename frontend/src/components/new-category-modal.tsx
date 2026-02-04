import { DialogProps } from '@/hooks/use-dialog'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Field, FieldError, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { CATEGORY_ICON_NAMES, CATEGORY_COLORS } from '@/lib/category-utils'
import { useMutation } from "@apollo/client/react"
import { CREATE_CATEGORY } from '@/lib/graphql/mutations/category'
import { toast } from 'sonner'
import { GET_CATEGORIES } from '@/lib/graphql/queries/category'

type ModalCategoryProps = DialogProps

const categoryFormSchema = z.object({
  name: z.string().min(1, "O título é obrigatório").min(3, "O título deve ter no mínimo 3 caracteres"),
  description: z.string().optional(),
  icon: z.string().min(1, "O ícone é obrigatório"),
  color: z.string().min(1, "A cor é obrigatória")
})

type CategoryFormData = z.infer<typeof categoryFormSchema>

export function ModalNewCategory(props: ModalCategoryProps) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      description: '',
      icon: '',
      color: ''
    }
  })

  const [createCategory, { loading }] = useMutation(CREATE_CATEGORY, {
    onCompleted: () => {
      toast.success('Categoria criada com sucesso!')
      form.reset()
      props.onOpenChange(false)
    },
  })

  async function handleCreateCategory(data: CategoryFormData) {
    try {
      await createCategory({
        variables: {
          data: {
            name: data.name,
            description: data.description,
            icon: data.icon,
            color: data.color
          }
        },
        refetchQueries: [{ query: GET_CATEGORIES }],
        awaitRefetchQueries: true
      })
    } catch (error) {
      console.error('Erro ao criar categoria:', error)
      toast.error('Erro ao criar categoria')
    }
  }

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
      <DialogContent className='max-w-md flex flex-col gap-6' showCloseButton={false}>
        <DialogHeader className='flex flex-row justify-between'>
          <div className='flex flex-col gap-[2px]'>
            <DialogTitle className='text-base text-gray-800 font-semibold'>Nova Categoria</DialogTitle>
            <DialogDescription className='text-sm text-gray-600'>Organize suas transações com categorias</DialogDescription>
          </div>
          <Button
            variant="outline"
            className='p-2 border border-gray-300 rounded-lg m-0'
            onClick={() => props.onOpenChange(false)}
          >
            <X size={16} />
          </Button>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleCreateCategory)} className='flex flex-col gap-6'>
          <Controller
            name='name'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={`flex flex-col gap-2`} >
                <FieldLabel htmlFor={field.name} className='active:bg-red-500'>Título</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder='Ex. Alimentação'
                  className={`px-3 py-[14px] focus-visible:ring-brand-base placeholder:text-gray-400 ${fieldState.invalid ? 'focus-visible:ring-red-base' : ''}`}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name='description'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={`flex flex-col gap-2`} >
                <FieldLabel htmlFor={field.name} className='active:bg-red-500'>
                  Descrição
                  <span className="text-gray-400 font-normal ml-1">(Opcional)</span>
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder='Descrição da categoria'
                  className={`px-3 py-[14px] focus-visible:ring-brand-base placeholder:text-gray-400`}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name='icon'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className='flex flex-col gap-2'>
                <FieldLabel>Ícone</FieldLabel>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-8 gap-2"
                >
                  {CATEGORY_ICON_NAMES.map((iconName) => {
                    const isSelected = field.value === iconName
                    return (
                      <Label
                        key={iconName}
                        className={`
                          group relative flex items-center justify-center px-3 py-[14px] w-[42px] h-[42px] rounded-lg border cursor-pointer
                          transition-all hover:border-brand-base hover:bg-gray-100
                          ${isSelected ? 'border-brand-base bg-gray-100' : 'border-gray-200 bg-white'}
                        `}
                      >
                        <RadioGroupItem
                          value={iconName}
                          className="sr-only"
                        />
                        <DynamicIcon name={iconName} size={20} className={`group-[hover:text-brand-base] ${isSelected ? 'text-gray-600' : 'text-gray-500'}`} />
                      </Label>
                    )
                  })}
                </RadioGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name='color'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className='flex flex-col gap-2'>
                <FieldLabel>Cor</FieldLabel>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex gap-3 h-8"
                >
                  {CATEGORY_COLORS.map((item) => {
                    const isSelected = field.value === item.name
                    return (
                      <Label
                        key={item.name}
                        className={`
                          relative cursor-pointer w-12 h-8 p-1 border rounded-lg hover:border-brand-base hover:bg-gray-100
                          ${isSelected ? 'border-brand-base bg-gray-100' : 'border-gray-300'}  
                        `}
                      >
                        <RadioGroupItem
                          value={item.name}
                          className="sr-only"
                        />
                        <div
                          className={`w-full h-full rounded-md ${item.bgClass}`}
                        />
                      </Label>
                    )
                  })}
                </RadioGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button
            type='submit'
            className='bg-brand-base hover:bg-brand-dark cursor-pointer text-white font-medium py-3 h-12'
            disabled={loading || form.formState.isSubmitting}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
import type { Category } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { CATEGORY_COLORS, CATEGORY_ICON_NAMES } from "@/lib/category-utils";
import { DynamicIcon } from "lucide-react/dynamic";
import { UPDATE_CATEGORY } from "@/lib/graphql/mutations/category";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";

interface UpdateCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category;
}

const updateCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  icon: z.string().min(1, "Ícone é obrigatório"),
  color: z.string().min(1, "Cor é obrigatória"),
});

type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;

export function UpdateCategoryModal(props: UpdateCategoryModalProps) {
  const form = useForm<UpdateCategoryFormData>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: props.category.name,
      description: props.category.description,
      icon: props.category.icon,
      color: props.category.color,
    }
  })

  const [updateCategory, { loading: updateCategoryLoading }] = useMutation(UPDATE_CATEGORY)

  async function handleUpdateCategory(data: UpdateCategoryFormData) {
    try {
      if (!props.category.id) return

      await updateCategory({
        variables: {
          id: props.category.id,
          data: {
            name: data.name,
            description: data.description,
            icon: data.icon,
            color: data.color
          }
        }
      })
      props.onOpenChange(false)
      toast.success("Categoria atualizada com sucesso.")
    } catch (error: unknown) {
      toast.error("Erro ao atualizar categoria. Tente novamente.")
      console.log(error);

    }
  }

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
      <DialogContent className='max-w-md flex flex-col gap-6' showCloseButton={false}>
        <DialogHeader className='flex flex-row justify-between'>
          <div className='flex flex-col gap-[2px]'>
            <DialogTitle className='text-base text-gray-800 font-semibold'>Editar Categoria {props.category.name}</DialogTitle>
            {/* <DialogDescription className='text-sm text-gray-600'>Organize suas transações com categorias</DialogDescription> */}
          </div>
          <Button
            variant="outline"
            className='p-2 border border-gray-300 rounded-lg m-0'
            onClick={() => props.onOpenChange(false)}
          >
            <X size={16} />
          </Button>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleUpdateCategory)} className='flex flex-col gap-6'>
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
            disabled={updateCategoryLoading || form.formState.isSubmitting}
          >
            {updateCategoryLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
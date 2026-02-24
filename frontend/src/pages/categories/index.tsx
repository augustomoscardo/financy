import { DeleteCategoryModal } from "@/components/delete-category-modal";
import { UpdateCategoryModal } from "@/components/update-category-modal";
import { ModalNewCategory } from "@/components/new-category-modal";
import { Page } from "@/components/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDialog } from "@/hooks/use-dialog";
import { getCategoryColor } from "@/lib/category-utils";
import { DELETE_CATEGORY } from "@/lib/graphql/mutations/category";
import { GET_CATEGORIES } from "@/lib/graphql/queries/category";
import type { Category } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { ArrowUpDown, Plus, SquarePen, Tag, Trash } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useState } from "react";
import { toast } from "sonner";

export function Categories() {
  const { data, loading } = useQuery<{ getCategories: Category[] }>(GET_CATEGORIES)
  const categories = data?.getCategories || []

  const [deleteCategory, { loading: deleteCategoryLoading }] = useMutation(DELETE_CATEGORY)

  const categoryDialog = useDialog()
  const deleteCategoryDialog = useDialog()
  const updateCategoryDialog = useDialog()
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  async function handleDeleteCategory() {
    try {
      if (!selectedCategory) return

      await deleteCategory({
        variables: { id: selectedCategory.id },
        refetchQueries: [{ query: GET_CATEGORIES }],
      })
      deleteCategoryDialog.onOpenChange(false)
      toast.success("Categoria deletada com sucesso.")
    } catch (error: unknown) {
      toast.error("Erro ao deletar categoria. Tente novamente.")
      console.log(error);

    }
  }

  const totalCategories = categories.length
  const totalTransactions = categories.reduce((acc, category) => acc + category.countTransactions, 0)
  const mostUsedCategory = categories.length
    ? categories.reduce((prev, current) => (prev.countTransactions > current.countTransactions ? prev : current), categories[0])
    : null

  function handleOpenDeleteCategoryDialog(category: Category) {
    setSelectedCategory(category)
    deleteCategoryDialog.onOpenChange(true)
  }

  function handleOpenUpdateCategoryDialog(category: Category) {
    setSelectedCategory(category)
    updateCategoryDialog.onOpenChange(true)
  }

  return (
    <Page className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[2px]">
          <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
          <p className="text-base text-gray-600">Organize suas transações por categorias.</p>
        </div>
        <Button className="flex items-center gap-2 bg-brand-base cursor-pointer text-white hover:bg-brand-dark"
          onClick={() => categoryDialog.onOpenChange(true)}>
          <Plus size={16} />
          Nova categoria
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col gap-4 w-full">
          <CardHeader className="p-0">
            <CardTitle className="flex items-center gap-4">
              <Tag size={24} className="text-gray-700" />
              <h3 className="text-gray-800 text-[38px] leading-8 font-bold">{totalCategories}</h3>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <span className="text-xs text-gray-500 leading-8 font-medium tracking-wide uppercase">Total de Categorias</span>
          </CardContent>
        </Card>
        <Card className="p-6 flex flex-col gap-4 w-full">
          <CardHeader className="p-0">
            <CardTitle className="flex items-center gap-4">
              <ArrowUpDown size={24} className="text-purple-base" />
              <h3 className="text-gray-800 text-[38px] leading-8 font-bold">{totalTransactions}</h3>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <span className="text-xs text-gray-500 leading-8 font-medium tracking-wide uppercase">Total de Transações</span>
          </CardContent>
        </Card>
        <Card className="p-6 flex flex-col gap-4 w-full">
          <CardHeader className="p-0">
            <CardTitle className="flex items-center gap-4">
              {mostUsedCategory?.countTransactions ? (
                <>
                  <DynamicIcon
                    name={mostUsedCategory.icon as React.ComponentProps<typeof DynamicIcon>["name"]}
                    size={24}
                    className={getCategoryColor(mostUsedCategory.color).textClass}
                  />
                  <h3 className="text-gray-800 text-[38px] leading-8 font-bold">{mostUsedCategory.name}</h3>
                </>
              ) : (
                <>
                  <h3 className="text-gray-800 text-base leading-8 font-bold">Nenhuma categoria foi registrada</h3>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <span className="text-xs text-gray-500 leading-8 font-medium tracking-wide uppercase">Categoria mais utilizada</span>
          </CardContent>
        </Card>
      </div>

      {loading && (
        <div className="grid grid-cols-4  gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card className="p-6" key={index}>
              <CardContent className="p-0 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="w-8 h-8 rounded-lg" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && categories.length > 0 && (
        <div className="grid grid-cols-4  gap-4">
          {categories.map((category) => {
            const categoryColor = getCategoryColor(category.color)

            return (
              <Card className="p-6" key={category.id}>
                <CardContent className="p-0 flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <Badge className={`p-3 ${categoryColor.lightBgClass}`}>
                      <DynamicIcon
                        name={category.icon as React.ComponentProps<typeof DynamicIcon>["name"]}
                        size={16}
                        className={categoryColor.textClass}
                      />
                    </Badge>
                    <div className="flex  items-center gap-2">
                      <Button className="text-danger bg-white border border-gray-300 rounded-lg w-8 h-8 hover:bg-gray-300" onClick={() => handleOpenDeleteCategoryDialog(category)}>
                        <Trash size={16} />
                      </Button>
                      <Button className="text-gray-700 bg-white border border-gray-300 rounded-lg w-8 h-8 hover:bg-gray-300" onClick={() => handleOpenUpdateCategoryDialog(category)}>
                        <SquarePen size={16} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-gray-800 font-semibold">{category.name}</h4>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={`${categoryColor.lightBgClass} ${categoryColor.textClass} py-1 px-3 rounded-full`}>
                      {category.name}
                    </Badge>
                    <span className="text-gray-600 text-sm">{category.countTransactions} itens</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {!loading && !categories.length && (
        <div className="grid">
          <Card className="p-6">
            <CardContent className="p-0 flex flex-col gap-5">
              <p className="text-center text-sm text-gray-500">Não há categorias registradas</p>
            </CardContent>
          </Card>
        </div>
      )}

      {categoryDialog.isOpen && (
        <ModalNewCategory
          {...categoryDialog}
        />
      )}

      {selectedCategory && deleteCategoryDialog.isOpen && (
        <DeleteCategoryModal
          {...deleteCategoryDialog}
          isOpen={deleteCategoryDialog.isOpen}
          onOpenChange={deleteCategoryDialog.onOpenChange}
          category={selectedCategory}
          onConfirm={handleDeleteCategory}
          isLoading={deleteCategoryLoading}
        />
      )}

      {selectedCategory && updateCategoryDialog.isOpen && (
        <UpdateCategoryModal
          {...updateCategoryDialog}
          isOpen={updateCategoryDialog.isOpen}
          onOpenChange={updateCategoryDialog.onOpenChange}
          category={selectedCategory}
        />
      )}
    </Page>
  )
}
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Category } from "@/types";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category;
  isLoading?: boolean;
  onConfirm: () => void;
}

export function DeleteCategoryModal({
  isOpen,
  onOpenChange,
  category,
  isLoading,
  onConfirm,
}: DeleteCategoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deletar categoria</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja deletar a categoria "
            <strong>{category?.name}</strong>"?
          </DialogDescription>
        </DialogHeader>

        {category && category.countTransactions > 0 && (
          <div className="flex gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-yellow-800">Atenção!</p>
              <p className="text-sm text-yellow-700">
                Esta categoria possui {category.countTransactions} transação(ões)
                vinculada(s). Ao deletar a categoria, todas as transações
                associadas também serão removidas.
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deletando..." : "Deletar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
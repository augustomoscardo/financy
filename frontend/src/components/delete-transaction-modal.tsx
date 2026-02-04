import type { Transaction } from "@/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import type { DialogProps } from "@/hooks/use-dialog";
import { toast } from "sonner";
import { GET_TRANSACTIONS } from "@/lib/graphql/queries/transaction";
import { DELETE_TRANSACTION } from "@/lib/graphql/mutations/transaction";
import { useMutation } from "@apollo/client/react";

type DeleteTransactionModalProps = {
  transaction: Transaction;
} & DialogProps

export function DeleteTransactionModal({ isOpen, onOpenChange, transaction }: DeleteTransactionModalProps) {
  const [deleteTransaction, { loading: deleteTransactionLoading }] = useMutation(DELETE_TRANSACTION)

  async function handleDeleteTransaction(id: string) {
    try {
      await deleteTransaction({
        variables: {
          id
        },
        refetchQueries: [{ query: GET_TRANSACTIONS }],
      })

      toast.success("Transação deletada com sucesso!")

      onOpenChange(false)
    } catch (error: unknown) {
      toast.error("Erro ao deletar transação.")
      console.log(error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deletar transação</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja deletar a transação "
            <strong>{transaction?.title}</strong>"?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDeleteTransaction(transaction.id)}
            disabled={deleteTransactionLoading}
          >
            {deleteTransactionLoading ? "Deletando..." : "Deletar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
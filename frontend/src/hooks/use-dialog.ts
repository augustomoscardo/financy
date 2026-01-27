import { useState } from "react";

export type DialogProps = ReturnType<typeof useDialog>

export function useDialog(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  function onOpenChange(open: boolean) {
    setIsOpen(open);
  }

  return {
    isOpen,
    onOpenChange
  }
}
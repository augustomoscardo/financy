import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageProps {
  children: ReactNode
  className?: string
}

export function Page({ children, className }: PageProps) {
  return (
    <div className={cn("min-h-[calc(100dvh-5rem)]", className)}>
      {children}
    </div>
  )
}
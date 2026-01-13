import type { ReactNode } from "react"

interface PageProps {
  children: ReactNode
}

export function Page({ children }: PageProps) {
  return (
    <div className="min-h-[calc(100dvh-5rem)" >
      {children}
    </div>
  )
}
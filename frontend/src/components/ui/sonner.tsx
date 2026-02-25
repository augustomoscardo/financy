"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:shadow-lg data-[type=success]:bg-green-100 data-[type=success]:text-green-800 data-[type=success]:border-green-200 data-[type=error]:bg-red-100 data-[type=error]:text-red-800 data-[type=error]:border-red-200 data-[type=warning]:bg-yellow-100 data-[type=warning]:text-yellow-800 data-[type=warning]:border-yellow-200",
          description: "group-[.toast]:text-current",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

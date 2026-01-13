import { Toaster } from "@/components/ui/sonner";
import { Header } from "./header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-dvh max-h-dvh bg-gray-100">
      <Header />
      <main className="mx-auto p-12 h-full">{children}</main>
      <Toaster />
    </div>
  );
}
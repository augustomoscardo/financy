import { Toaster } from "@/components/ui/sonner";
import { Header } from "./header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-dvh bg-gray-100">
      <Header />
      <main className="mx-auto h-full w-full max-w-7xl p-4 sm:p-6 lg:p-12">{children}</main>
      <Toaster />
    </div>
  );
}
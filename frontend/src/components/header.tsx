import { useAuthStore } from "@/stores/auth";
import { Avatar, AvatarFallback } from "./ui/avatar";
import logoImg from "@/assets/logo.svg"
import { Link } from "react-router-dom";
import { LinkPage } from "./link-page";
import { Button } from "./ui/button";

export function Header() {
  const { isAuthenticated, user } = useAuthStore((state) => state)

  return (
    <header className="w-full px-4 py-3 sm:px-6 lg:px-12 lg:py-4">
      {isAuthenticated && (
        <div className="flex items-center justify-between gap-2 lg:gap-0">
          <img src={logoImg} alt="Logo da Financy" />

          <nav
            aria-label="Navegação principal"
            className="-mx-1 flex items-center gap-1 overflow-x-auto px-1 whitespace-nowrap sm:gap-2 lg:mx-0 lg:gap-5 lg:overflow-visible lg:px-0 lg:whitespace-normal"
          >
            <LinkPage name="Dashboard" destination="/" />
            <LinkPage name="Transações" destination="/transactions" />
            <LinkPage name="Categorias" destination="/categories" />
          </nav>

          <Link to="/profile" aria-label="Abrir perfil">
            <Button className="h-11 w-11 rounded-full bg-transparent p-0 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-offset-2 lg:h-9 lg:w-9" asChild>
              <Avatar className="p-0">
                <AvatarFallback className="bg-gray-300 text-gray-800">
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </Link>
        </div>
      )}
    </header>
  )
}
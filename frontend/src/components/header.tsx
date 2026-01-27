import { useAuthStore } from "@/stores/auth";
import { Avatar, AvatarFallback } from "./ui/avatar";
import logoImg from "@/assets/logo.svg"
import { Link } from "react-router-dom";
import { LinkPage } from "./link-page";
import { Button } from "./ui/button";

export function Header() {
  const { isAuthenticated, user } = useAuthStore((state) => state)

  return (
    <div className="w-full py-4 px-12">
      {isAuthenticated && (
        <div className="flex justify-between">
          <img src={logoImg} alt="Logo da Financy" />
          <nav className="flex items-center gap-5">
            <LinkPage name="Dashboard" destination="/" />
            <LinkPage name="Transações" destination="/transactions" />
            <LinkPage name="Categorias" destination="/categories" />
          </nav>
          <Link to="/profile">
            <Button className="w-9 h-9 bg-transparent hover:bg-transparent rounded-full" asChild>
              <Avatar className="p-0">
                <AvatarFallback className="bg-gray-300 text-gray-800">
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
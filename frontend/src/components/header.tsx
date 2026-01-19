import { useAuthStore } from "@/stores/auth";
import { Avatar, AvatarFallback } from "./ui/avatar";
import logoImg from "@/assets/logo.svg"
import { useNavigate } from "react-router-dom";
import { LinkPage } from "./link-page";

export function Header() {
  const { isAuthenticated, logout, user } = useAuthStore((state) => state)

  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div className="w-full py-4 px-12">
      {isAuthenticated && (
        <div className="flex  justify-between">
          <img src={logoImg} alt="Logo da Financy" />
          <nav className="flex items-center gap-5">
            <LinkPage name="Dashboard" destination="/" />
            <LinkPage name="Transações" destination="/transactions" />
            <LinkPage name="Categorias" destination="/categories" />
          </nav>
          <Avatar>
            <AvatarFallback className="bg-gray-300 text-gray-800">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  )
}
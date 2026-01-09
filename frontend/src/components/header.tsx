import { Avatar, AvatarFallback } from "./ui/avatar";
import logoImg from "@/assets/logo.svg"

export function Header() {
  return (
    <div>
      <img src={logoImg} alt="Logo da Financy" />
      <nav></nav>
      <Avatar>
        <AvatarFallback className="bg-zinc-950 text-primary-foreground">
          {/* {user?.name?.charAt(0)} */}
          A
        </AvatarFallback>
      </Avatar>
    </div>
  )
}
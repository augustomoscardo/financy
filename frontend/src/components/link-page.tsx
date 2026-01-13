import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

interface LinkPageProps {
  name: string
  destination: string
}

export function LinkPage({ name, destination }: LinkPageProps) {
  const location = useLocation();
  const isActive = location.pathname === destination;

  return (
    <Link to={destination}>
      <Button
        size="default"
        variant={isActive ? "default" : "ghost"}
        className={`p-0 bg-transparent outline-none border-none shadow-none hover:bg-transparent hover:underline hover:text-brand-base ${isActive ? "cursor-default text-brand-base font-semibold" : " cursor-pointer"}`}
      >
        {name}
      </Button>
    </Link>
  )
}
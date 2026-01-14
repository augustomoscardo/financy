import { Page } from "@/components/page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BriefcaseBusiness, ChevronRight, CircleArrowDown, CircleArrowUp, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

export function Dashboard() {
  return (
    <Page>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-6 w-full">
          <Card className="p-6 flex flex-col gap-4 w-full">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-3">
                <Wallet size={20} className="text-purple-base" />
                <h3 className="text-gray-500 uppercase text-xs font-medium tracking-wide">Saldo Total</h3>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <span className="text-3xl text-gray-800 leading-8 font-bold">R$ 12847,32</span>
            </CardContent>
          </Card>
          <Card className="p-6 flex flex-col gap-4 w-full">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-3">
                <CircleArrowUp size={20} className="text-brand-base" />
                <h3 className="text-gray-500 uppercase text-xs font-medium tracking-wide">Receitas do Mês</h3>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <span className="text-3xl text-gray-800 leading-8 font-bold">R$ 4250,00</span>
            </CardContent>
          </Card>
          <Card className="p-6 flex flex-col gap-4 w-full">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-3">
                <CircleArrowDown size={20} className="text-red-base" />
                <h3 className="text-gray-500 uppercase text-xs font-medium tracking-wide">Despesas do Mês</h3>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <span className="text-3xl text-gray-800 leading-8 font-bold">R$ 2180,45</span>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-6">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between py-5 px-6">
              <h4 className="text-xs tracking-wide text-gray-500 uppercase font-medium">Transações Recentes</h4>
              <Link to="/transactions" className="text-sm leading-5 font-medium text-brand-base flex items-center gap-1 hover:underline hover:text-brand-dark">
                Ver todas
                <ChevronRight size={20} />
              </Link>
            </CardHeader>
            <Separator />
            <CardContent>
              <div className="px-6 py-4 flex items-center">
                <div className="flex-1 flex items-center gap-4">
                  <Badge className="bg-green-light p-3 rounded-lg">
                    <BriefcaseBusiness size={16} className="text-green-base" />
                  </Badge>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-800 font-medium leading-6">Pagamento Salário</p>
                    <span className="text-gray-600 leading-5 text-sm">01/12/2025</span>
                  </div>
                </div>
                <Badge>Receita</Badge>
                <div>
                  <p></p>
                  <CircleArrowUp />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1 flex flex-col"></Card>
        </div>
      </div>
    </Page>
  )
}
import { Page } from "@/components/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BriefcaseBusiness, ChevronRight, CircleArrowDown, CircleArrowUp, Plus, Wallet } from "lucide-react";
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
            <CardContent className="p-0">
              <div className="px-6 py-4 flex items-center gap-12">
                <div className="flex-1 flex items-center gap-4">
                  <Badge className="bg-green-light p-3 rounded-lg">
                    <BriefcaseBusiness size={16} className="text-green-base" />
                  </Badge>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-800 font-medium leading-6">Pagamento Salário</p>
                    <span className="text-gray-600 leading-5 text-sm">01/12/25</span>
                  </div>
                </div>
                <Badge className="bg-green-light text-green-dark text-sm leading-5 font-medium rounded-full px-3 py-1 shadow-none">Receita</Badge>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-800 font-semibold leading-5">+ R$ 4250,00</p>
                  <CircleArrowUp className="text-brand-base" />
                </div>
              </div>
              <Separator />
              <div className="px-6 py-4 flex items-center gap-12">
                <div className="flex-1 flex items-center gap-4">
                  <Badge className="bg-green-light p-3 rounded-lg">
                    <BriefcaseBusiness size={16} className="text-green-base" />
                  </Badge>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-800 font-medium leading-6">Pagamento Salário</p>
                    <span className="text-gray-600 leading-5 text-sm">01/12/25</span>
                  </div>
                </div>
                <Badge className="bg-green-light text-green-dark text-sm leading-5 font-medium rounded-full px-3 py-1 shadow-none">Receita</Badge>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-800 font-semibold leading-5">+ R$ 4250,00</p>
                  <CircleArrowUp className="text-brand-base" />
                </div>
              </div>
              <Separator />
              <div className="px-6 py-4 flex items-center gap-12">
                <div className="flex-1 flex items-center gap-4">
                  <Badge className="bg-green-light p-3 rounded-lg">
                    <BriefcaseBusiness size={16} className="text-green-base" />
                  </Badge>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-800 font-medium leading-6">Pagamento Salário</p>
                    <span className="text-gray-600 leading-5 text-sm">01/12/25</span>
                  </div>
                </div>
                <Badge className="bg-green-light text-green-dark text-sm leading-5 font-medium rounded-full px-3 py-1 shadow-none">Receita</Badge>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-800 font-semibold leading-5">+ R$ 4250,00</p>
                  <CircleArrowUp className="text-brand-base" />
                </div>
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="flex items-center justify-center py-5 px-6">
              <Button variant="link" className="text-brand-base text-sm leading-5 font-medium hover:text-brand-dark hover:underline">
                <Plus size={20} />
                Nova transação
              </Button>
            </CardFooter>
          </Card>
          <Card className="flex flex-col min-w-96">
            <CardHeader className="flex flex-row items-center justify-between py-5 px-6">
              <h4 className="text-xs tracking-wide text-gray-500 uppercase font-medium">Categorias</h4>
              <Link to="/categories" className="text-sm leading-5 font-medium text-brand-base flex items-center gap-1 hover:underline hover:text-brand-dark">
                Gerenciar
                <ChevronRight size={20} />
              </Link>
            </CardHeader>
            <Separator />
            <CardContent className="p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between gap-1">
                <Badge className="bg-blue-light text-blue-dark text-sm leading-5 font-medium rounded-full px-3 py-1 shadow-none">
                  Alimentação
                </Badge>
                <span className="text-sm text-gray-600 leading-5">12 itens</span>
                <p className="text-sm text-gray-800 font-semibold leading-5">R$ 542,30</p>
              </div>
              <div className="flex items-center justify-between ">
                <Badge className="bg-blue-light text-blue-dark text-sm leading-5 font-medium rounded-full px-3 py-1 shadow-none">
                  Alimentação
                </Badge>
                <span className="text-sm text-gray-600 leading-5">12 itens</span>
                <p className="text-sm text-gray-800 font-semibold leading-5">R$ 542,30</p>
              </div>
              <div className="flex items-center justify-between ">
                <Badge className="bg-blue-light text-blue-dark text-sm leading-5 font-medium rounded-full px-3 py-1 shadow-none">
                  Alimentação
                </Badge>
                <span className="text-sm text-gray-600 leading-5">12 itens</span>
                <p className="text-sm text-gray-800 font-semibold leading-5">R$ 542,30</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Page>
  )
}
import logoImg from "@/assets/logo.svg";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EyeClosed, Lock, Mail, UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";

const loginFormSchema = z.object({
  email: z.string().min(1, "O email é obrigatório").email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  rememberMe: z.boolean(),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export function Login() {
  const login = useAuthStore((state) => state.login)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { errors, isSubmitting } = form.formState;

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("@financy_remembered_email");

    if (rememberedEmail) {
      form.setValue("email", rememberedEmail);
      form.setValue("rememberMe", true);
    }
  }, [form]);

  async function handleLogin(data: LoginFormData) {
    try {
      const loginMutate = await login({
        email: data.email,
        password: data.password,
      })

      if (loginMutate) {
        if (data.rememberMe) {
          localStorage.setItem("@financy_remembered_email", data.email);
        } else {
          localStorage.removeItem("@financy_remembered_email");
        }

        toast.success("Logged in successfully!")
      }
    } catch (error: unknown) {
      toast.error("Failed to log in. Please check your credentials and try again.")
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <img src={logoImg} alt="Logo" />

      <Card className="max-w-md w-full p-8 flex flex-col gap-8">
        <CardHeader className="flex flex-col gap-1 justify-center p-0">
          <CardTitle className="text-center font-bold text-xl text-gray-800 leading-7">
            Fazer login
          </CardTitle>
          <CardDescription className="text-center text-gray-600 leading-6">
            Entre na sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <form
            onSubmit={form.handleSubmit(handleLogin)}
            className="flex flex-col gap-4"
            autoComplete="on"
          >
            <Controller
              name="email"
              control={form.control}
              render={({ field }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name} className="text-gray-700">
                      Email
                    </FieldLabel>
                    <div
                      className={`flex items-center gap-3 border border-gray-300 rounded-md py-[14px] px-3 ${errors.email ? "border-red-500" : ""
                        }`}
                    >
                      <Mail size={16} className="text-gray-400" />
                      <Input
                        {...field}
                        id={field.name}
                        type="email"
                        autoComplete="username"
                        placeholder="mail@example.com"
                        className="border-none outline-none focus:ring-0 focus-visible:ring-0 p-0 shadow-none placeholder:text-gray-400 rounded-none h-4 leading-[18px]"
                      />
                    </div>
                    {errors.email && (
                      <span className="text-xs text-red-500">
                        {errors.email.message}
                      </span>
                    )}
                  </Field>
                );
              }}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name} className="text-gray-700">
                      Password
                    </FieldLabel>
                    <div
                      className={`flex items-center gap-3 border border-gray-300 rounded-md py-[14px] px-3 ${errors.password ? "border-red-500" : ""
                        }`}
                    >
                      <Lock size={16} className="text-gray-400" />
                      <Input
                        {...field}
                        id={field.name}
                        type="password"
                        autoComplete="current-password"
                        placeholder="Digite sua senha"
                        className="border-none outline-none focus:ring-0 focus-visible:ring-0 p-0 shadow-none placeholder:text-gray-400 rounded-none h-4 leading-[18px]"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="p-0 hover:bg-transparent text-gray-400 hover:text-gray-700 h-4"
                      >
                        <EyeClosed size={16} className="" />
                      </Button>
                    </div>
                    {errors.password && (
                      <span className="text-xs text-red-500">
                        {errors.password.message}
                      </span>
                    )}
                  </Field>
                );
              }}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Input
                  id="remind-me"
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer"
                  {...form.register("rememberMe")}
                />
                <Label
                  htmlFor="remind-me"
                  className="text-gray-700 text-sm cursor-pointer leading-5"
                >
                  Lembrar-me
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-brand-base text-decoration-none hover:underline hover:text-brand-dark leading-5"
              >
                Recuperar senha
              </Link>
            </div>

            <Button
              className={`
                bg-brand-base text-white rounded-md p-3
                ${isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-brand-dark"
                }
                `}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Aguarde..." : "Entrar"}
            </Button>

            <div className="flex items-center gap-3 w-full">
              <Separator className="shrink bg-gray-300" />
              <span className="text-gray-500 text-sm leading-5">ou</span>
              <Separator className="shrink bg-gray-300" />
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-center text-gray-600 text-sm leading-5">
                Ainda não tem uma conta?
              </span>

              <Button
                asChild
                className="bg-white rounded-md p-3 border border-gray-300 text-gray-700 hover:bg-gray-300"
              >
                <Link to="/signup">
                  <UserRoundPlus size={16} />
                  Criar conta
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

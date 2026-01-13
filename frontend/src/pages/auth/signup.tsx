import logoImg from "@/assets/logo.svg";
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
import { EyeClosed, Lock, LogIn, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";

const signupFormSchema = z.object({
  name: z
    .string()
    .min(1, "O nome é obrigatório")
    .refine(
      (val) => val.trim().split(/\s+/).length >= 2,
      "Digite seu nome completo"
    ),
  email: z.string().min(1, "O email é obrigatório").email("Email inválido"),
  password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(
      /[^A-Za-z0-9]/,
      "A senha deve conter pelo menos um caractere especial"
    ),
});

type SignupFormData = z.infer<typeof signupFormSchema>;

export function Signup() {
  const signup = useAuthStore((state) => state.signup)

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { errors, isSubmitting } = form.formState;

  async function handleSignup(data: SignupFormData) {
    console.log(data);

    try {
      const signupMutate = await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      if (signupMutate) {
        toast.success("Acount created successfully! You can now log in.")
      }

    } catch (error: unknown) {
      toast.error("Failed to create account. Please try again.")
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <img src={logoImg} alt="Logo" />

      <Card className="max-w-md w-full p-8 flex flex-col gap-8">
        <CardHeader className="flex flex-col gap-1 justify-center p-0">
          <CardTitle className="text-center font-bold text-xl text-gray-800 leading-7">
            Criar conta
          </CardTitle>
          <CardDescription className="text-center text-gray-600 leading-6">
            Comece a controlar suas finanças ainda hoje
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <form
            onSubmit={form.handleSubmit(handleSignup)}
            className="flex flex-col gap-4"
          >
            <Controller
              name="name"
              control={form.control}
              render={({ field }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name} className="text-gray-700">
                      Nome completo
                    </FieldLabel>
                    <div
                      className={`flex items-center gap-3 border border-gray-300 rounded-md py-[14px] px-3 ${errors.name ? "border-red-500" : ""
                        }`}
                    >
                      <UserRound size={16} className="text-gray-400" />
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="Seu nome completo"
                        className="border-none outline-none focus:ring-0 focus-visible:ring-0 p-0 shadow-none placeholder:text-gray-400 rounded-none h-4 leading-[18px]"
                      />
                    </div>
                    {errors.name && (
                      <span className="text-xs text-red-500">
                        {errors.name.message}
                      </span>
                    )}
                  </Field>
                );
              }}
            />

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
                      Senha
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
                    {errors.password ? (
                      <span className="text-xs text-red-500">
                        {errors.password.message}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">
                        A senha deve ter no mínimo 8 caracteres
                      </span>
                    )}
                  </Field>
                );
              }}
            />

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
              {isSubmitting ? "Aguarde..." : "Criar conta"}
            </Button>

            <div className="flex items-center gap-3 w-full">
              <Separator className="shrink bg-gray-300" />
              <span className="text-gray-500 text-sm leading-5">ou</span>
              <Separator className="shrink bg-gray-300" />
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-center text-gray-600 text-sm leading-5">
                Já tem uma conta?
              </span>

              <Button
                asChild
                className="bg-white rounded-md p-3 border border-gray-300 text-gray-700 hover:bg-gray-300"
              >
                <Link to="/login">
                  <LogIn size={18} />
                  Login
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

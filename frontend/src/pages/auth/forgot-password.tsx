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
import { LogIn, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const forgotPasswordFormSchema = z.object({
  email: z.string().min(1, "O email é obrigatório").email("Email inválido"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>;

export function ForgotPassword() {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const { errors, isSubmitting } = form.formState;

  async function handleRequestPasswordReset(data: ForgotPasswordFormData) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success(`Se o e-mail ${data.email} existir, enviaremos um link de recuperação.`);
      form.reset();
    } catch (error: unknown) {
      toast.error("Não foi possível solicitar a recuperação de senha. Tente novamente.");
      console.log(error);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-6 px-1 py-4 sm:gap-8 sm:py-6">
      <img src={logoImg} alt="Logo" />

      <Card className="w-full p-5 sm:p-8 flex flex-col gap-6 sm:gap-8">
        <CardHeader className="flex flex-col gap-1 justify-center p-0">
          <CardTitle className="text-center font-bold text-xl text-gray-800 leading-7">
            Recuperar senha
          </CardTitle>
          <CardDescription className="text-center text-gray-600 leading-6">
            Informe seu e-mail para receber o link de redefinição
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <form
            onSubmit={form.handleSubmit(handleRequestPasswordReset)}
            className="flex flex-col gap-6"
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
                        placeholder="mail@example.com"
                        className="border-none outline-none focus:ring-0 focus-visible:ring-0 p-0 shadow-none placeholder:text-gray-400 rounded-none h-4 leading-[18px]"
                      />
                    </div>
                    {errors.email && (
                      <span className="text-xs text-red-500">{errors.email.message}</span>
                    )}
                  </Field>
                );
              }}
            />

            <Button
              className={`bg-brand-base text-white rounded-md p-3 ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-brand-dark"
                }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar link"}
            </Button>

            <Button
              asChild
              className="bg-white rounded-md p-3 border border-gray-300 text-gray-700 hover:bg-gray-300"
            >
              <Link to="/login">
                <LogIn size={18} />
                Login
              </Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

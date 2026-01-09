import logoImg from "@/assets/logo.svg"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

const signupFormSchema = z.object({
  name: z.string().min(1, "Informe seu nome"),
  email: z.email("Email inválido"),
  password: z.string().min(1, "Informe sua senha"),
})

type SignupFormData = z.infer<typeof signupFormSchema>

export function Signup() {
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function handleSignup(data: SignupFormData) {
    console.log(data);

  }

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <img src={logoImg} alt="Logo" />

      <Card className="max-w-md w-full p-8">
        <CardHeader className="flex flex-col gap-1 justify-center">
          <CardTitle className="text-center font-bold text-xl text-gray-800">Criar conta</CardTitle>
          <CardDescription className="text-center text-gray-600">Comece a controlar suas finanças ainda hoje.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSignup)}>
            <Controller
              name="name"
              control={form.control}
              render={({ field }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Nome</FieldLabel>

                    <div>
                      <Mail size={16} />
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="Seu nome completo"
                      />
                    </div>
                  </Field>
                )
              }}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
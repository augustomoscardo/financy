import { Page } from "@/components/page";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogOut, Mail, UserRound } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(1, "O nome é obrigatório")
    .refine(
      (val) => val.trim().split(/\s+/).length >= 2,
      "Digite seu nome completo"
    ),
  email: z.string().min(1, "O email é obrigatório").email("Email inválido"),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

export function Profile() {
  const { user, updateProfile, logout } = useAuthStore((state) => state)

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: ""
    },
  });

  const { errors } = form.formState;

  const navigate = useNavigate()

  async function handleUpdateProfile(data: ProfileFormData) {
    console.log(data);

    try {
      const signupMutate = await updateProfile({
        name: data.name,
      })

      if (signupMutate) {
        toast.success("Acount created successfully! You can now log in.")
      }

    } catch (error: unknown) {
      toast.error("Failed to create account. Please try again.")
      console.log(error);
    }
  }


  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <Page className="">
      <Card className="max-w-md w-full p-5 sm:p-8 flex flex-col gap-6 sm:gap-8 mx-auto">
        <CardHeader className="flex flex-col gap-6 items-center gap p-0">
          <Avatar className="p-0 w-16 h-16">
            <AvatarFallback className="bg-gray-300 text-gray-800 font-medium text-2xl leading-10">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center gap-[2px]">
            <CardTitle>{user?.name}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0 flex flex-col gap-8">
          <form
            onSubmit={form.handleSubmit(handleUpdateProfile)}
            className="flex flex-col gap-4"
          >
            <Controller
              name="name"
              control={form.control}
              render={({ field }) => {
                return (
                  <Field className="gap-2">
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
                        value={user?.name}
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
              disabled
              control={form.control}
              render={({ field }) => {
                return (
                  <Field className="gap-2">
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
                        value={user?.email}
                        placeholder="mail@example.com"
                        className="border-none outline-none focus:ring-0 focus-visible:ring-0 p-0 shadow-none placeholder:text-gray-400 rounded-none h-4 leading-[18px]"
                      />
                    </div>
                    {errors.email && (
                      <span className="text-xs text-red-500">
                        {errors.email.message}
                      </span>
                    )}
                    <FieldDescription>
                      O e-mail não pode ser alterado
                    </FieldDescription>
                  </Field>
                );
              }}
            />
          </form>
          <div className="flex flex-col gap-4">
            <Button className="py-3 bg-brand-base text-white font-medium hover:bg-brand-dark">Salvar alterações</Button>
            <Button
              className="py-3 flex items-center gap-2 text-gray-700 font-medium border border-gray-300 hover:bg-gray-300"
              variant="outline"
              onClick={handleLogout}
            >
              <LogOut size={18} className="text-danger" />
              Sair da conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </Page>
  )
}
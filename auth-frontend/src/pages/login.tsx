import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    await login(data.email, data.password);
    navigate("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          Entrar
          <CardDescription>Acesse sua conta</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-500">Email inválido</p>
            )}
          </div>
          <div>
            <Label>Senha</Label>
            <Input type="password" {...register("password")} />
            {errors.password && (
              <p className="text-sm text-red-500">Senha inválida</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button
            className="w-full text-gray-600 hover:text-gray-800"
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            Entrar
          </Button>

          <Link
            to="/register"
            className="text-sm text-muted-foreground hover:underline"
          >
            Não possui uma conta? Cadastre-se
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

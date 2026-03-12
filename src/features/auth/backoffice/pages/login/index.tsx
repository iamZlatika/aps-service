import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import { AuthRoutes } from "@/features/auth/routes.ts";
import { useAuth } from "@/features/auth/useAuth.ts";
import { OrdersRoutes } from "@/features/backoffice/modules/orders/routers.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";
import { cn } from "@/shared/lib/utils.ts";

import { type LoginFormValues, loginSchema } from "./login.schema.ts";

export default function BackofficeLoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data, {
      onSuccess: () => navigate(OrdersRoutes.linkToOrders()),
      onError: (error) => handleFormError<LoginFormValues>(error, setError),
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {t("auth.login.title")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("auth.login.description")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.login.email")}</Label>
              <Input
                autoFocus
                id="email"
                autoComplete="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className={cn(errors.email && "border-destructive")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.login.password")}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
                className={cn(errors.password && "border-destructive")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn
                ? t("auth.login.submitting")
                : t("auth.login.submit")}
            </Button>

            <Link
              to={AuthRoutes.linkToForgot()}
              className="text-sm text-blue-600 hover:underline text-center"
            >
              {t("auth.login.forgot_password")}
            </Link>

            {errors.root && (
              <p className="text-sm text-destructive text-center mb-4">
                {errors.root.message}
              </p>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

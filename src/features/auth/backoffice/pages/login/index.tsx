import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { AuthRoutes } from "@/features/auth/backoffice/api/routes.ts";
import { useAuth } from "@/features/auth/backoffice/hooks/useAuth.ts";
import { Loader } from "@/shared/components/common/Loader.tsx";
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

import { createLoginSchema, type LoginFormValues } from "./login.schema.ts";

export default function BackofficeLoginPage() {
  const { t } = useTranslation();
  const { login, isLoggingIn, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(createLoginSchema()),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Covers both the login request itself and the subsequent profile fetch
  // GuestRoute waits on before redirecting — one continuous busy state.
  const isBusy = isLoggingIn || isLoading;

  const onSubmit = (data: LoginFormValues) => {
    // Warms the lazy chunks GuestRoute redirects into on success, in parallel
    // with the login request itself — otherwise Suspense has to show its own
    // fallback right after this page's loader, producing a double flash.
    void import("@/features/backoffice/components/Layout");
    void import("@/features/backoffice/modules/orders/pages");
    login(data, {
      onError: (error) => handleFormError<LoginFormValues>(error, setError),
    });
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4">
      {isBusy && <Loader className="min-h-0 w-auto p-0" />}
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
                disabled={isBusy}
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
                disabled={isBusy}
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
            <Button type="submit" className="w-full" disabled={isBusy}>
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

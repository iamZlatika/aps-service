import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import { authApi } from "@/features/auth/api";
import { AuthRoutes } from "@/features/auth/api/routes.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { QueryPageGuard } from "@/shared/components/errors/QueryPageGuard";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";
import { cn } from "@/shared/lib/utils.ts";

import {
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from "./forgot.schema";
import Loader from "@/shared/components/common/Loader.tsx";

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";
  const rawEmail = searchParams.get("email") || "";
  const email = decodeURIComponent(rawEmail);

  const { isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.auth.resetCheck(token!, email!),
    queryFn: () => authApi.resetCheckToken({ token, email }),
    enabled: !!token && !!email,
    retry: false,
  });

  const resetMutation = useMutation({
    mutationFn: authApi.resetPassword,
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetMutation.mutate(
      { ...data, token, email },
      {
        onSuccess: () => navigate(AuthRoutes.linkToLogin()),
        onError: (error) =>
          handleFormError<ResetPasswordFormValues>(error, setError),
      },
    );
  };

  if (!token || !email) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive text-center">
              {t("auth.reset.error_title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {t("auth.reset.invalid_link")}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <QueryPageGuard
      isError={isError}
      error={error}
      isLoading={isLoading}
      loadingFallback={<Loader />}
      onRetry={() => refetch()}
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {t("auth.reset.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.reset.password")}</Label>
                <Input
                  autoFocus
                  id="password"
                  type="password"
                  {...register("password")}
                  className={cn(errors.password && "border-destructive")}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">
                  {t("auth.reset.confirm_password")}
                </Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  {...register("password_confirmation")}
                  className={cn(
                    errors.password_confirmation && "border-destructive",
                  )}
                />
                {errors.password_confirmation && (
                  <p className="text-sm text-destructive">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={resetMutation.isPending}
              >
                {resetMutation.isPending
                  ? t("auth.reset.submitting")
                  : t("auth.reset.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </QueryPageGuard>
  );
};

export default ResetPasswordPage;

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import { authApi } from "@/features/auth/api.ts";
import { AuthRoutes } from "@/features/auth/routes.ts";
import { type ValidationError } from "@/shared/api/types.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import { handleFormError } from "@/shared/lib/errorHandlers/formErrorHandler.ts";
import { isApiError } from "@/shared/lib/errorHandlers/services.ts";
import { cn } from "@/shared/lib/utils.ts";

import {
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from "./forgot.schema";

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setErrorState] = useState<string | null>(null);

  const token = searchParams.get("token") || "";
  const rawEmail = searchParams.get("email") || "";
  const email = decodeURIComponent(rawEmail);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    (async () => {
      if (!token || !email) {
        setIsValid(false);
        setIsValidating(false);
        return;
      }

      try {
        await authApi.resetCheckToken({ token, email });
        setIsValid(true);
      } catch (err: unknown) {
        setIsValid(false);
        if (isApiError<ValidationError>(err)) {
          setErrorState(err.message || t("errors.invalid_link"));
        } else {
          setErrorState(t("errors.check_link_error"));
        }
      } finally {
        setIsValidating(false);
      }
    })();
  }, [token, email]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    const resetPasswordData = { ...data, token, email };
    try {
      await authApi.resetPassword(resetPasswordData);

      navigate(AuthRoutes.linkToLogin());
    } catch (error: unknown) {
      handleFormError<ResetPasswordFormValues>(error, setError);
    }
  };

  if (isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p>{t("auth.reset.checking_link")}</p>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive text-center">
              {t("auth.reset.error_title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {error || t("auth.reset.invalid_link")}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? t("auth.reset.submitting")
                : t("auth.reset.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { authApi } from "@/features/auth/api.ts";
import { AuthRoutes } from "@/features/auth/routes.ts";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";
import { cn } from "@/shared/lib/utils.ts";

import { type ForgotFormValues, forgotSchema } from "./forgot.schema";

const ForgotPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const forgotMutation = useMutation({
    mutationFn: authApi.forgot,
  });
  const onSubmit = (data: ForgotFormValues) => {
    forgotMutation.mutate(data, {
      onSuccess: () => navigate(AuthRoutes.linkToEmailSent()),
      onError: (error) => handleFormError<ForgotFormValues>(error, setError),
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("auth.forgot.title")}</CardTitle>
          <CardDescription>{t("auth.forgot.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.login.email")}</Label>
              <Input
                autoFocus
                id="email"
                type="email"
                className={cn(errors.email && "border-destructive")}
                placeholder="name@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={forgotMutation.isPending}
            >
              {forgotMutation.isPending
                ? t("auth.forgot.submitting")
                : t("auth.forgot.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPage;

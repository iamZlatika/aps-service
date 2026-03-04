import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { handleFormError } from "@/shared/lib/errorHandlers/formErrorHandler.ts";
import { cn } from "@/shared/lib/utils.ts";

import { type ForgotFormValues, forgotSchema } from "./forgot.schema";

const ForgotPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormValues): Promise<void> => {
    try {
      await authApi.forgot(data);
      navigate(AuthRoutes.linkToEmailSent());
    } catch (error: unknown) {
      handleFormError<ForgotFormValues>(error, setError);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Восстановление пароля</CardTitle>
          <CardDescription>
            Укажите Ваш эмейл для восстановления пароля
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Отправка..." : "Отправить"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPage;

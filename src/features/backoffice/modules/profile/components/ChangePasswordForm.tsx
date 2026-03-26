import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { authApi } from "@/features/auth/api";
import { mapChangePasswordToApi } from "@/features/auth/lib/adapter.ts";
import {
  type ChangePasswordFormValues,
  changePasswordSchema,
} from "@/features/backoffice/modules/profile/change-password.schema.ts";
import ConfirmDialog from "@/features/backoffice/modules/profile/components/ConfirmDialog.tsx";
import Loader from "@/shared/components/common/Loader.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";
import { cn } from "@/shared/lib/utils.ts";

const ChangePasswordForm = () => {
  const { t } = useTranslation();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const changePasswordMutation = useMutation({
    mutationFn: authApi.changePassword,
  });

  const onSubmit = (data: ChangePasswordFormValues) => {
    changePasswordMutation.mutate(mapChangePasswordToApi(data), {
      onSuccess: () => setIsSuccessOpen(true),
      onError: (error) =>
        handleFormError<ChangePasswordFormValues>(error, setError, {
          fieldMap: {
            current_password: "currentPassword",
            password: "newPassword",
            password_confirmation: "confirmPassword",
          },
          messageMap: {
            "The password is incorrect.": t(
              "profile.change_form.wrong_current_password",
            ),
          },
        }),
    });
  };
  return (
    <div className="relative">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">
            {t("profile.change_form.enter_old_password")}
          </Label>
          <Input
            autoFocus
            type="password"
            className={cn(errors.currentPassword && "border-destructive")}
            {...register("currentPassword")}
          />
          {errors.currentPassword && (
            <p className="text-sm text-destructive">
              {errors.currentPassword.message}
            </p>
          )}
          <Label htmlFor="newPassword">
            {t("profile.change_form.enter_new_password")}
          </Label>
          <Input
            type="password"
            className={cn(errors.newPassword && "border-destructive")}
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-sm text-destructive">
              {errors.newPassword.message}
            </p>
          )}
          <Label htmlFor="confirm_new_password">
            {t("profile.change_form.confirm_new_password")}
          </Label>
          <Input
            type="password"
            className={cn(errors.confirmPassword && "border-destructive")}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={changePasswordMutation.isPending}
        >
          {changePasswordMutation.isPending
            ? t("auth.forgot.submitting")
            : t("auth.forgot.submit")}
        </Button>
      </form>
      {changePasswordMutation.isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-md">
          <Loader />
        </div>
      )}
      <ConfirmDialog
        open={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
      />
    </div>
  );
};

export default ChangePasswordForm;

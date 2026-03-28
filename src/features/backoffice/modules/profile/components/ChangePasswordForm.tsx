import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { profileApi } from "@/features/backoffice/modules/profile/api";
import PasswordChangedDialog from "@/features/backoffice/modules/profile/components/PasswordChangedDialog.tsx";
import { mapChangePasswordToApi } from "@/features/backoffice/modules/profile/lib/adapter.ts";
import {
  type ChangePasswordFormValues,
  createProfileSchema,
} from "@/features/backoffice/modules/profile/profile.schema.ts";
import { FormField } from "@/shared/components/common/FormField.tsx";
import Loader from "@/shared/components/common/Loader.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

const ChangePasswordForm = () => {
  const { t } = useTranslation();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const schema = useMemo(() => createProfileSchema(), []);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(schema),
  });

  const changePasswordMutation = useMutation({
    mutationFn: profileApi.changePassword,
    meta: { silent: true },
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
          <FormField
            type="password"
            error={errors.currentPassword}
            {...register("currentPassword")}
          />
          <Label htmlFor="newPassword">
            {t("profile.change_form.enter_new_password")}
          </Label>
          <FormField
            type="password"
            error={errors.newPassword}
            {...register("newPassword")}
          />
          <Label htmlFor="confirm_new_password">
            {t("profile.change_form.confirm_new_password")}
          </Label>
          <FormField
            type="password"
            error={errors.confirmPassword}
            {...register("confirmPassword")}
          />
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
      <PasswordChangedDialog
        open={isSuccessOpen}
        onClose={() => {
          setIsSuccessOpen(false);
          reset();
        }}
      />
    </div>
  );
};

export default ChangePasswordForm;

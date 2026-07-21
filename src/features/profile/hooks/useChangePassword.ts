import { useMutation } from "@tanstack/react-query";
import type { UseFormSetError } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { profileApi } from "@/features/profile/api";
import { mapChangePasswordToApi } from "@/features/profile/lib/adapters.ts";
import type { ChangePasswordFormValues } from "@/features/profile/profile.schema.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

type UseChangePasswordReturn = {
  changePassword: (data: ChangePasswordFormValues) => void;
  isPending: boolean;
};

export const useChangePassword = (
  setError: UseFormSetError<ChangePasswordFormValues>,
  onSuccess: () => void,
): UseChangePasswordReturn => {
  const { t } = useTranslation();

  const { mutate, isPending } = useMutation({
    mutationFn: profileApi.changePassword,
    meta: { silent: true },
    onSuccess,
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

  return {
    changePassword: (data) => mutate(mapChangePasswordToApi(data)),
    isPending,
  };
};

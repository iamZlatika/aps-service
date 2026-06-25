import { useMutation } from "@tanstack/react-query";
import type { UseFormSetError } from "react-hook-form";

import { websiteAuthApi } from "@/features/auth/website/api";
import { mapResetPasswordValuesToRequestBody } from "@/features/auth/website/lib/adapters";
import { type ResetPasswordFormValues } from "@/features/auth/website/pages/reset-password/reset-password.schema";
import { handleFormError } from "@/shared/lib/errors/handleFormError";
import { notifyError } from "@/shared/lib/errors/services";

type UseResetPasswordReturn = {
  submit: (
    values: ResetPasswordFormValues,
    options?: { onSuccess?: () => void },
  ) => void;
  isPending: boolean;
};

export const useResetPassword = (
  token: string,
  email: string,
  setError: UseFormSetError<ResetPasswordFormValues>,
): UseResetPasswordReturn => {
  const mutation = useMutation<void, Error, ResetPasswordFormValues>({
    mutationFn: (values) =>
      websiteAuthApi.resetPassword({
        token,
        email,
        ...mapResetPasswordValuesToRequestBody(values),
      }),
    onError: (error) => {
      notifyError(error);
      handleFormError<ResetPasswordFormValues>(error, setError, {
        fieldMap: { password_confirmation: "confirmPassword" },
      });
    },
  });

  return {
    submit: (values, options) =>
      mutation.mutate(values, { onSuccess: options?.onSuccess }),
    isPending: mutation.isPending,
  };
};

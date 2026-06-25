import { useMutation } from "@tanstack/react-query";
import type { UseFormSetError } from "react-hook-form";

import { websiteAuthApi } from "@/features/auth/website/api";
import { type ForgotFormValues } from "@/features/auth/website/pages/forgot/forgot.schema";
import { handleFormError } from "@/shared/lib/errors/handleFormError";
import { isApiError, notifyError } from "@/shared/lib/errors/services";

type UseForgotPasswordReturn = {
  submit: (
    values: ForgotFormValues,
    options?: { onSuccess?: () => void },
  ) => void;
  isPending: boolean;
};

export const useForgotPassword = (
  setError: UseFormSetError<ForgotFormValues>,
): UseForgotPasswordReturn => {
  const mutation = useMutation<void, Error, ForgotFormValues>({
    mutationFn: (values) => websiteAuthApi.forgotPassword(values.email),
    onError: (error) => {
      if (!isApiError(error) || error.status !== 422) {
        notifyError(error);
      }
      handleFormError<ForgotFormValues>(error, setError);
    },
  });

  return {
    submit: (values, options) =>
      mutation.mutate(values, { onSuccess: options?.onSuccess }),
    isPending: mutation.isPending,
  };
};

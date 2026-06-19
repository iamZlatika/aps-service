import { useMutation } from "@tanstack/react-query";
import type { UseFormSetError } from "react-hook-form";

import { websiteAuthApi } from "@/features/auth/website/api";
import { type ForgotPasswordValues } from "@/features/auth/website/types";
import { handleFormError } from "@/shared/lib/errors/handleFormError";
import { notifyError } from "@/shared/lib/errors/services";

type UseForgotPasswordReturn = {
  submit: (
    values: ForgotPasswordValues,
    options?: { onSuccess?: () => void },
  ) => void;
  isPending: boolean;
};

export const useForgotPassword = (
  setError: UseFormSetError<ForgotPasswordValues>,
): UseForgotPasswordReturn => {
  const mutation = useMutation<void, Error, ForgotPasswordValues>({
    mutationFn: (values) => websiteAuthApi.forgotPassword(values.email),
    onError: (error) => {
      notifyError(error);
      handleFormError<ForgotPasswordValues>(error, setError);
    },
  });

  return {
    submit: (values, options) =>
      mutation.mutate(values, { onSuccess: options?.onSuccess }),
    isPending: mutation.isPending,
  };
};

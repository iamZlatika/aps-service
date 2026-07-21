import { useMutation } from "@tanstack/react-query";
import type { UseFormSetError } from "react-hook-form";

import { authApi } from "@/features/auth/api";
import { type ForgotFormValues } from "@/features/auth/pages/forgot/forgot.schema";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

type UseForgotPasswordReturn = {
  forgotPassword: (data: ForgotFormValues) => void;
  isPending: boolean;
};

export const useForgotPassword = (
  setError: UseFormSetError<ForgotFormValues>,
  onSuccess: () => void,
): UseForgotPasswordReturn => {
  const { mutate, isPending } = useMutation({
    mutationFn: authApi.forgot,
    onSuccess,
    onError: (error) => handleFormError<ForgotFormValues>(error, setError),
  });

  return { forgotPassword: mutate, isPending };
};

import { useMutation, useQuery } from "@tanstack/react-query";
import type { UseFormSetError } from "react-hook-form";

import { authApi } from "@/features/auth/backoffice/api";
import { type ResetPasswordFormValues } from "@/features/auth/backoffice/pages/forgot/forgot.schema";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

type UseResetPasswordParams = {
  token: string;
  email: string;
  setError: UseFormSetError<ResetPasswordFormValues>;
  onSuccess: () => void;
};

type UseResetPasswordReturn = {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  resetPassword: (data: ResetPasswordFormValues) => void;
  isPending: boolean;
};

export const useResetPassword = ({
  token,
  email,
  setError,
  onSuccess,
}: UseResetPasswordParams): UseResetPasswordReturn => {
  const { isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.auth.resetCheck(token, email),
    queryFn: () => authApi.resetCheckToken({ token, email }),
    enabled: !!token && !!email,
    retry: false,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess,
    onError: (error) =>
      handleFormError<ResetPasswordFormValues>(error, setError),
  });

  return {
    isLoading,
    isError,
    error,
    refetch,
    resetPassword: (data) => mutate({ ...data, token, email }),
    isPending,
  };
};

import { useMutation } from "@tanstack/react-query";

import { websiteAuthApi } from "@/features/auth/website/api";
import { type AuthResponse } from "@/features/auth/website/types";

import { type LoginFormValues } from "./login.schema";

type UseLoginReturn = {
  submit: (
    values: LoginFormValues,
    options?: {
      onSuccess?: (data: AuthResponse) => void;
      onError?: (error: Error) => void;
    },
  ) => void;
  isPending: boolean;
};

export const useLogin = (): UseLoginReturn => {
  const mutation = useMutation<AuthResponse, Error, LoginFormValues>({
    mutationFn: (values) =>
      websiteAuthApi.login({
        email: values.email,
        password: values.password,
      }),
  });

  return {
    submit: (values, options) =>
      mutation.mutate(values, {
        onSuccess: options?.onSuccess,
        onError: options?.onError,
      }),
    isPending: mutation.isPending,
  };
};

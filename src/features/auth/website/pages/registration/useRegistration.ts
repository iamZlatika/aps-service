import { useMutation } from "@tanstack/react-query";

import { websiteAuthApi } from "@/features/auth/website/api";
import { type RegistrationResponse } from "@/features/auth/website/types";

import { type RegistrationFormValues } from "./registration.schema";

type UseRegistrationReturn = {
  submit: (
    values: RegistrationFormValues,
    options?: {
      onSuccess?: (data: RegistrationResponse) => void;
      onError?: (error: Error) => void;
    },
  ) => void;
  isPending: boolean;
};

export const useRegistration = (): UseRegistrationReturn => {
  const mutation = useMutation<
    RegistrationResponse,
    Error,
    RegistrationFormValues
  >({
    mutationFn: (values) =>
      websiteAuthApi.register({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        password_confirmation: values.passwordConfirmation,
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

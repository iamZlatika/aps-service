import { useMutation } from "@tanstack/react-query";
import type { UseFormSetError } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { websiteAuthApi } from "@/features/auth/website/api";
import { type AuthResponse } from "@/features/auth/website/types";
import { handleFormError } from "@/shared/lib/errors/handleFormError";
import { isApiError } from "@/shared/lib/errors/services";

import { type LoginFormValues } from "./login.schema";

type UseLoginReturn = {
  submit: (
    values: LoginFormValues,
    options?: { onSuccess?: (data: AuthResponse) => void },
  ) => void;
  isPending: boolean;
};

export const useLogin = (
  setError: UseFormSetError<LoginFormValues>,
): UseLoginReturn => {
  const { t } = useTranslation("website");

  const mutation = useMutation<AuthResponse, Error, LoginFormValues>({
    mutationFn: (values) =>
      websiteAuthApi.login({
        email: values.email,
        password: values.password,
      }),
    onError: (error) => {
      if (isApiError(error) && error.status === 403) {
        setError("root", { message: t("login.emailNotVerified") });
      } else {
        handleFormError<LoginFormValues>(error, setError);
      }
    },
  });

  return {
    submit: (values, options) =>
      mutation.mutate(values, { onSuccess: options?.onSuccess }),
    isPending: mutation.isPending,
  };
};

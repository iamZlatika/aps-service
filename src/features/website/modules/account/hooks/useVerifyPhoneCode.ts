import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseFormSetError } from "react-hook-form";

import { websiteAuthApi } from "@/features/auth/website/api";
import { type Customer } from "@/features/auth/website/types";
import { type VerifyPhoneCodeFormValues } from "@/features/website/modules/account/account.schema";
import { mapVerifyPhoneCodeToRequestBody } from "@/features/website/modules/account/lib/adapters";
import { queryKeys } from "@/shared/api/queryKeys";
import { handleFormError } from "@/shared/lib/errors/handleFormError";
import { notifyError } from "@/shared/lib/errors/services";

type UseVerifyPhoneCodeReturn = {
  submit: (
    values: VerifyPhoneCodeFormValues,
    options?: { onSuccess?: () => void },
  ) => void;
  isPending: boolean;
};

export const useVerifyPhoneCode = (
  setError: UseFormSetError<VerifyPhoneCodeFormValues>,
): UseVerifyPhoneCodeReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Customer, Error, VerifyPhoneCodeFormValues>({
    mutationFn: (values) =>
      websiteAuthApi.verifyPhoneCode(mapVerifyPhoneCodeToRequestBody(values)),
    onSuccess: (customer) => {
      queryClient.setQueryData(queryKeys.customer.me(), customer);
    },
    onError: (error) => {
      notifyError(error);
      handleFormError<VerifyPhoneCodeFormValues>(error, setError, {
        fieldMap: { code: "code" },
      });
    },
  });

  return {
    submit: (values, options) =>
      mutation.mutate(values, { onSuccess: options?.onSuccess }),
    isPending: mutation.isPending,
  };
};

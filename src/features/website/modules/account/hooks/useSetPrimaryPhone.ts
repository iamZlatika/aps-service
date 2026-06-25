import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type Customer } from "@/features/auth/website/types";
import { customerProfileApi } from "@/features/website/modules/profile/api";
import { queryKeys } from "@/shared/api/queryKeys";
import { notifyError } from "@/shared/lib/errors/services";

type UseSetPrimaryPhoneReturn = {
  submit: (
    phone: string,
    options?: { onSuccess?: (customer: Customer) => void },
  ) => void;
  isPending: boolean;
};

export const useSetPrimaryPhone = (): UseSetPrimaryPhoneReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Customer, Error, string>({
    mutationFn: (phone) => customerProfileApi.setPrimaryPhone(phone),
    onSuccess: (customer) => {
      queryClient.setQueryData(queryKeys.customer.me(), customer);
    },
    onError: (error) => notifyError(error),
  });

  return {
    submit: (phone, options) =>
      mutation.mutate(phone, { onSuccess: options?.onSuccess }),
    isPending: mutation.isPending,
  };
};

import { useMutation } from "@tanstack/react-query";

import { customersApi } from "@/features/backoffice/modules/customers/api";
import { updateCustomerCache } from "@/features/backoffice/modules/customers/lib/cache.ts";
import type {
  Customer,
  EditedCustomer,
} from "@/features/backoffice/modules/customers/types.ts";
import { isApiError, notifyError } from "@/shared/lib/errors/services.ts";

type UseCustomerInfoReturn = {
  handleChangeInfo: (data: EditedCustomer) => Promise<Customer | undefined>;
  isInfoPending: boolean;
};

export const useCustomerInfo = (
  customerId: number | null,
  onSuccess?: () => void,
): UseCustomerInfoReturn => {
  const changeInfoMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EditedCustomer }) =>
      customersApi.changeCustomerInfo(id, data),
    onSuccess: async (updatedCustomer) => {
      await updateCustomerCache(updatedCustomer);
      onSuccess?.();
    },
    onError: (error) => {
      if (!isApiError(error) || error.status !== 422) {
        notifyError(error);
      }
    },
  });

  const handleChangeInfo = (data: EditedCustomer) => {
    if (customerId) {
      return changeInfoMutation.mutateAsync({ id: customerId, data });
    }
    return Promise.resolve(undefined);
  };

  return {
    handleChangeInfo,
    isInfoPending: changeInfoMutation.isPending,
  };
};

import { useMutation } from "@tanstack/react-query";

import { customersApi } from "@/features/backoffice/modules/customers/api";
import { updateCustomerCache } from "@/features/backoffice/modules/customers/lib/cache.ts";
import type { CustomerInfo } from "@/features/backoffice/modules/customers/types.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { isApiError, notifyError } from "@/shared/lib/errors/services.ts";

type UseMergeCustomerReturn = {
  mergeCustomer: (
    absorbedCustomerId: number,
  ) => Promise<CustomerInfo | undefined>;
  isMergePending: boolean;
};

export const useMergeCustomer = (
  survivorId: number | null,
  onSuccess?: () => void,
): UseMergeCustomerReturn => {
  const mergeMutation = useMutation({
    mutationFn: ({
      id,
      absorbedCustomerId,
    }: {
      id: number;
      absorbedCustomerId: number;
    }) => customersApi.mergeCustomer(id, absorbedCustomerId),
    onSuccess: async (mergedCustomer, variables) => {
      await updateCustomerCache(mergedCustomer);
      queryClient.removeQueries({
        queryKey: queryKeys.customers.detail(variables.absorbedCustomerId),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.customers.list(),
      });
      onSuccess?.();
    },
    onError: (error) => {
      if (!isApiError(error) || error.status !== 422) {
        notifyError(error);
      }
    },
  });

  const mergeCustomer = (absorbedCustomerId: number) => {
    if (survivorId) {
      return mergeMutation.mutateAsync({ id: survivorId, absorbedCustomerId });
    }
    return Promise.resolve(undefined);
  };

  return { mergeCustomer, isMergePending: mergeMutation.isPending };
};

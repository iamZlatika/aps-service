import { useMutation } from "@tanstack/react-query";
import i18next from "i18next";
import { useCallback } from "react";
import { toast } from "sonner";

import { customersApi } from "@/features/backoffice/modules/customers/api";
import type { CustomerInfo } from "@/features/backoffice/modules/customers/types.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import type { ValidationError } from "@/shared/api/types.ts";
import { isApiError, notifyError } from "@/shared/lib/errors/services.ts";

type UseMergeCustomerReturn = {
  mergeCustomer: (
    absorbedCustomerId: number,
  ) => Promise<CustomerInfo | undefined>;
  isMergePending: boolean;
  mergeError: string | null;
  clearMergeError: () => void;
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
      queryClient.removeQueries({
        queryKey: queryKeys.customers.detail(variables.absorbedCustomerId),
      });
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.customers.detail(mergedCustomer.id),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.customers.list(),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders.all,
        }),
      ]);
      toast.success(i18next.t("customers.merge.success"));
      onSuccess?.();
    },
    onError: (error) => {
      if (!isApiError<ValidationError>(error) || error.status !== 422) {
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

  const rawError = mergeMutation.error;
  const mergeError =
    isApiError<ValidationError>(rawError) && rawError.status === 422
      ? (rawError.data?.errors.absorbed_customer_id?.[0] ??
        rawError.message ??
        null)
      : null;

  const clearMergeError = useCallback(() => {
    mergeMutation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    mergeCustomer,
    isMergePending: mergeMutation.isPending,
    mergeError,
    clearMergeError,
  };
};

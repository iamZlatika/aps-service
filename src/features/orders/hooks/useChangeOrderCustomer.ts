import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { useCallback } from "react";
import { toast } from "sonner";

import { ordersApi } from "@/features/orders/api";
import { queryKeys } from "@/shared/api/queryKeys";
import type { ValidationError } from "@/shared/api/types.ts";
import { isApiError, notifyError } from "@/shared/lib/errors/services.ts";

type UseChangeOrderCustomerReturn = {
  changeCustomer: (customerId: number) => Promise<void>;
  isPending: boolean;
  changeError: string | null;
  clearChangeError: () => void;
};

export function useChangeOrderCustomer(
  orderId: number,
  currentCustomerId: number,
  onSuccess: () => void,
): UseChangeOrderCustomerReturn {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (customerId: number) =>
      ordersApi.changeCustomer(orderId, customerId),
    onSuccess: async (_data, customerId) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders.detail(orderId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.customers.detail(currentCustomerId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.customers.detail(customerId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders.byCustomer(currentCustomerId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders.byCustomer(customerId),
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.customers.list() }),
      ]);
      toast.success(i18next.t("orders.changeCustomer.success"));
      onSuccess();
    },
    onError: (error) => {
      const fieldError =
        isApiError<ValidationError>(error) && error.status === 422
          ? error.data?.errors.customer_id?.[0]
          : undefined;
      if (!fieldError) {
        notifyError(error);
      }
    },
  });

  const changeCustomer = (customerId: number) =>
    mutation.mutateAsync(customerId);

  const rawError = mutation.error;
  const changeError =
    isApiError<ValidationError>(rawError) && rawError.status === 422
      ? (rawError.data?.errors.customer_id?.[0] ?? rawError.message ?? null)
      : null;

  const clearChangeError = useCallback(() => {
    mutation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    changeCustomer,
    isPending: mutation.isPending,
    changeError,
    clearChangeError,
  };
}

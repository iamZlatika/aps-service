import { useMutation } from "@tanstack/react-query";
import i18next from "i18next";
import { toast } from "sonner";

import { ordersApi } from "@/features/orders/api";
import type { OrderPayment } from "@/features/orders/types.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseDeletePaymentReturn = {
  onDelete: (item: OrderPayment) => void;
  isPending: boolean;
};

export const useDeletePayment = (orderId: number): UseDeletePaymentReturn => {
  const mutation = useMutation({
    mutationFn: (item: OrderPayment) =>
      ordersApi.deletePayment(orderId, item.id),
    onSuccess: () => {
      toast.success(i18next.t("common.deleteDialog.success"));
      return queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(orderId),
      });
    },
  });

  return { onDelete: mutation.mutate, isPending: mutation.isPending };
};

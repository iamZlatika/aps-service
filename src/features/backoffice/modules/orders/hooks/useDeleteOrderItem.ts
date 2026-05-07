import { useMutation } from "@tanstack/react-query";
import i18next from "i18next";
import { toast } from "sonner";

import { ordersApi } from "@/features/backoffice/modules/orders/api";
import type { OrderItem } from "@/features/backoffice/modules/orders/types.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseDeleteOrderItemReturn = {
  onDelete: (item: OrderItem) => void;
  isPending: boolean;
};

export const useDeleteOrderItem = (
  orderId: number,
): UseDeleteOrderItemReturn => {
  const mutation = useMutation({
    mutationFn: (item: OrderItem) =>
      item.type === "product"
        ? ordersApi.deleteProductInOrder(orderId, item.id)
        : ordersApi.deleteServiceInOrder(orderId, item.id),
    onSuccess: () => {
      toast.success(i18next.t("common.deleteDialog.success"));
      return queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(orderId),
      });
    },
  });

  return { onDelete: mutation.mutate, isPending: mutation.isPending };
};

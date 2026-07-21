import { useMutation } from "@tanstack/react-query";
import i18next from "i18next";
import { toast } from "sonner";

import { ordersApi } from "@/features/orders/api";
import type { OrderItem } from "@/features/orders/types.ts";
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
      // Removing a service/product recalculates the referral's pending
      // referral_income — refresh referrals so the pending amount stays in sync.
      void queryClient.invalidateQueries({ queryKey: queryKeys.referrals.all });
      // Broad invalidation (not just this order's detail) — removing an item
      // changes the order's total sum, which the orders table also displays,
      // so the list cache needs refreshing too.
      return queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });

  return { onDelete: mutation.mutate, isPending: mutation.isPending };
};

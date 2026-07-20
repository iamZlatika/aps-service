import { useMutation } from "@tanstack/react-query";
import i18next from "i18next";
import { toast } from "sonner";

import { ordersApi } from "@/features/backoffice/modules/orders/api";
import type { NewOrderItemSchema } from "@/features/backoffice/modules/orders/lib/schema.ts";
import type {
  OrderItemType,
  OrderProduct,
  OrderService,
} from "@/features/backoffice/modules/orders/types.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseOrderItemSubmitParams = {
  orderId: number;
  type: OrderItemType;
  editItemId?: number;
  onSuccess: () => void;
};

type UseOrderItemSubmitReturn = {
  onSubmit: (data: NewOrderItemSchema) => void;
  isPending: boolean;
};

export const useOrderItemSubmit = ({
  orderId,
  type,
  editItemId,
  onSuccess,
}: UseOrderItemSubmitParams): UseOrderItemSubmitReturn => {
  const isEdit = editItemId !== undefined;

  const mutation = useMutation<
    OrderProduct | OrderService,
    Error,
    NewOrderItemSchema
  >({
    mutationFn: (data: NewOrderItemSchema) => {
      if (type === "product") {
        const payload = {
          name: data.name,
          price: data.price,
          purchasePrice: data.purchasePrice ?? "",
          supplierName: data.supplierName ?? "",
          quantity: data.quantity,
          managerId: data.managerId ?? null,
        };
        return isEdit
          ? ordersApi.editProductInOrder(orderId, payload, editItemId)
          : ordersApi.addProductToOrder(orderId, payload);
      }
      const payload = {
        name: data.name,
        price: data.price,
        costPrice: data.costPrice ?? "",
        outsourcerName: data.outsourcerName ?? "",
        quantity: data.quantity,
        managerId: data.managerId ?? null,
      };
      return isEdit
        ? ordersApi.editServiceInOrder(orderId, payload, editItemId)
        : ordersApi.addServiceToOrder(orderId, payload);
    },
    onSuccess: () => {
      const toastKeys = {
        product: {
          add: "orders.orderTable.successAddProduct",
          edit: "orders.orderTable.successEditProduct",
        },
        service: {
          add: "orders.orderTable.successAddService",
          edit: "orders.orderTable.successEditService",
        },
      };
      toast.success(i18next.t(toastKeys[type][isEdit ? "edit" : "add"]));
      onSuccess();
      // Services/products recalculate the referral's pending referral_income —
      // refresh referrals so the pending amount stays in sync.
      void queryClient.invalidateQueries({ queryKey: queryKeys.referrals.all });
      // Broad invalidation (not just this order's detail) — adding/removing
      // an item changes the order's total sum, which the orders table also
      // displays, so the list cache needs refreshing too.
      return queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });

  return { onSubmit: mutation.mutate, isPending: mutation.isPending };
};

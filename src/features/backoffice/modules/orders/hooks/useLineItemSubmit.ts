import { useMutation } from "@tanstack/react-query";
import i18next from "i18next";
import { toast } from "sonner";

import { ordersApi } from "@/features/backoffice/modules/orders/api";
import type { NewLineItemSchema } from "@/features/backoffice/modules/orders/lib/schema.ts";
import type {
  OrderProduct,
  OrderService,
} from "@/features/backoffice/modules/orders/types.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type LineItemType = "product" | "service";

type UseLineItemSubmitParams = {
  orderId: number;
  type: LineItemType;
  editItemId?: number;
  onSuccess: () => void;
};

type UseLineItemSubmitReturn = {
  onSubmit: (data: NewLineItemSchema) => void;
  isPending: boolean;
};

export const useLineItemSubmit = ({
  orderId,
  type,
  editItemId,
  onSuccess,
}: UseLineItemSubmitParams): UseLineItemSubmitReturn => {
  const isEdit = editItemId !== undefined;

  const mutation = useMutation<
    OrderProduct | OrderService,
    Error,
    NewLineItemSchema
  >({
    mutationFn: (data: NewLineItemSchema) => {
      if (type === "product") {
        const payload = {
          name: data.name,
          price: data.price,
          purchasePrice: data.purchasePrice ?? "",
          supplierName: data.supplierName ?? null,
          quantity: data.quantity,
          userId: data.userId ?? null,
        };
        return isEdit
          ? ordersApi.editProductInOrder(orderId, payload, editItemId)
          : ordersApi.addProductToOrder(orderId, payload);
      }
      const payload = {
        name: data.name,
        price: data.price,
        costPrice: data.costPrice ?? "",
        quantity: data.quantity,
        userId: data.userId ?? null,
      };
      return isEdit
        ? ordersApi.editServiceInOrder(orderId, payload, editItemId)
        : ordersApi.addServiceToOrder(orderId, payload);
    },
    onSuccess: () => {
      const key = isEdit
        ? type === "product"
          ? "orders.orderTable.successEditProduct"
          : "orders.orderTable.successEditService"
        : type === "product"
          ? "orders.orderTable.successAddProduct"
          : "orders.orderTable.successAddService";
      toast.success(i18next.t(key));
      onSuccess();
      return queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(orderId),
      });
    },
  });

  return { onSubmit: mutation.mutate, isPending: mutation.isPending };
};

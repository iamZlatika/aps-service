import { useMutation } from "@tanstack/react-query";
import i18next from "i18next";
import { toast } from "sonner";

import { ordersApi } from "@/features/backoffice/modules/orders/api";
import type { NewLineItemSchema } from "@/features/backoffice/modules/orders/lib/schema.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type LineItemType = "product" | "service";

type UseAddLineItemReturn = {
  onSubmit: (data: NewLineItemSchema) => void;
  isPending: boolean;
};

export const useAddLineItem = (
  orderId: number,
  type: LineItemType,
  onSuccess: () => void,
): UseAddLineItemReturn => {
  const mutation = useMutation({
    mutationFn: (data: NewLineItemSchema) =>
      type === "product"
        ? ordersApi.addProductToOrder(orderId, {
            name: data.name,
            price: data.price,
            purchasePrice: data.purchasePrice ?? "",
            supplierName: data.supplierName ?? null,
            quantity: data.quantity,
          })
        : ordersApi.addServiceToOrder(orderId, {
            name: data.name,
            price: data.price,
            costPrice: data.costPrice ?? "",
            quantity: data.quantity,
          }),
    onSuccess: () => {
      const key =
        type === "product"
          ? "orders.orderTable.successAddProduct"
          : "orders.orderTable.successAddService";
      toast.success(i18next.t(key));
      onSuccess();
      return queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(orderId),
      });
    },
    onError: () => {
      toast.error(i18next.t("errors.unknown"));
    },
  });

  return { onSubmit: mutation.mutate, isPending: mutation.isPending };
};

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { ordersApi } from "@/features/orders/api";
import {
  type OrderWarehouseLineFormValues,
  type OrderWarehouseLineSchema,
  orderWarehouseLineSchema,
} from "@/features/orders/lib/schema.ts";
import {
  getLineCostPrice,
  getWarehouseLineSource,
  getWarehouseSourceErrorMessage,
  isDonorPartSource,
} from "@/features/warehouse/lib/service.ts";
import type { WarehouseSearchResult } from "@/features/warehouse/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import type { ValidationError } from "@/shared/api/types.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";
import { isApiError, notifyError } from "@/shared/lib/errors/services.ts";

const FIELD_MAP = {
  manager_id: "managerId",
  cost_price: "costPrice",
} as const;

type UseOrderWarehouseLineFormParams = {
  orderId: number;
  result: WarehouseSearchResult;
  onSuccess: () => void;
};

type UseOrderWarehouseLineFormReturn = {
  methods: UseFormReturn<
    OrderWarehouseLineFormValues,
    unknown,
    OrderWarehouseLineSchema
  >;
  onSubmit: (values: OrderWarehouseLineSchema) => void;
  isPending: boolean;
};

export const useOrderWarehouseLineForm = ({
  orderId,
  result,
  onSuccess,
}: UseOrderWarehouseLineFormParams): UseOrderWarehouseLineFormReturn => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const methods = useForm<
    OrderWarehouseLineFormValues,
    unknown,
    OrderWarehouseLineSchema
  >({
    resolver: zodResolver(orderWarehouseLineSchema()),
    defaultValues: {
      // The card price is only a default — a discount is normal.
      price: result.price ?? "",
      quantity: "1",
      costPrice: result.purchasePrice ?? "",
      managerId: user?.id,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: OrderWarehouseLineSchema) =>
      ordersApi.addProductToOrder(orderId, {
        ...getWarehouseLineSource(result),
        // Whole donors are sold through their own button, not this picker.
        warehouseDonorId: null,
        name: result.name,
        price: values.price,
        purchasePrice: "",
        supplierName: "",
        quantity: isDonorPartSource(result) ? 1 : values.quantity,
        costPrice: getLineCostPrice(result, values.costPrice),
        managerId: values.managerId,
      }),
    onSuccess: () => {
      toast.success(i18next.t("orders.orderTable.successAddProduct"));
      onSuccess();
      // The line changes the order total and the item's stock / part status.
      void queryClient.invalidateQueries({ queryKey: queryKeys.warehouse.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.referrals.all });
      return queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
    onError: (error) => {
      if (isApiError(error) && error.status === 422) {
        handleFormError(error, methods.setError, { fieldMap: FIELD_MAP });
        // Source errors (part already used, …) belong to the line as a whole.
        const sourceError = getWarehouseSourceErrorMessage(
          isApiError<ValidationError>(error) ? error.data?.errors : undefined,
        );
        if (sourceError) {
          methods.setError("root", { type: "server", message: sourceError });
        }
        // E.g. the part was just taken by someone else — refresh the picker.
        void queryClient.invalidateQueries({
          queryKey: queryKeys.warehouse.searchAll(),
        });
      } else {
        notifyError(error);
      }
    },
  });

  return {
    methods,
    onSubmit: mutation.mutate,
    isPending: mutation.isPending,
  };
};

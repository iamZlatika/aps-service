import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { ordersApi } from "@/features/orders/api";
import {
  type SellDonorFormValues,
  type SellDonorSchema,
  sellDonorSchema,
} from "@/features/warehouse/lib/orderActions.schema.ts";
import {
  getWarehouseSourceErrorMessage,
  mapDonorSalePartRows,
} from "@/features/warehouse/lib/service.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import type { ValidationError } from "@/shared/api/types.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";
import { isApiError, notifyError } from "@/shared/lib/errors/services.ts";

const FIELD_MAP = {
  manager_id: "managerId",
  price: "price",
} as const;

type UseSellDonorParams = {
  orderId: number;
  onSuccess: () => void;
};

type UseSellDonorReturn = {
  methods: UseFormReturn<SellDonorFormValues, unknown, SellDonorSchema>;
  onSubmit: (values: SellDonorSchema) => void;
  isPending: boolean;
};

/**
 * Adds a donor as an order line (`warehouse_donor_id` + `donor_parts`). The
 * backend names the line after the donor and sets its purchase: Σ cost prices
 * of the picked parts, or acquisition + investments when none are picked (then
 * every part goes). Deleting the line brings the donor and parts back.
 */
export const useSellDonor = ({
  orderId,
  onSuccess,
}: UseSellDonorParams): UseSellDonorReturn => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const methods = useForm<SellDonorFormValues, unknown, SellDonorSchema>({
    resolver: zodResolver(sellDonorSchema()),
    defaultValues: {
      donorId: null,
      donorLabel: "",
      parts: [],
      price: "",
      managerId: user?.id,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: SellDonorSchema) =>
      ordersApi.addProductToOrder(orderId, {
        warehouseItemId: null,
        donorPartId: null,
        warehouseDonorId: values.donorId,
        donorParts: mapDonorSalePartRows(values.parts),
        // Not sent for a warehouse line — the backend snapshots the donor.
        name: values.donorLabel,
        purchasePrice: "",
        supplierName: "",
        price: values.price,
        // A donor is one physical device.
        quantity: 1,
        managerId: values.managerId,
      }),
    onSuccess: () => {
      toast.success(i18next.t("warehouse.orderActions.sellDonorSuccess"));
      void queryClient.invalidateQueries({ queryKey: queryKeys.warehouse.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.referrals.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      onSuccess();
    },
    onError: (error) => {
      if (isApiError(error) && error.status === 422) {
        handleFormError(error, methods.setError, { fieldMap: FIELD_MAP });
        // "Already sold", "part not in this donor", "part has no cost
        // price", … — show it on the donor field and refresh the warehouse.
        const sourceError = getWarehouseSourceErrorMessage(
          isApiError<ValidationError>(error) ? error.data?.errors : undefined,
        );
        if (sourceError) {
          methods.setError("donorId", { type: "server", message: sourceError });
        }
        // The list it was picked from and the donor card (parts, costs).
        void queryClient.invalidateQueries({
          queryKey: queryKeys.warehouse.all,
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

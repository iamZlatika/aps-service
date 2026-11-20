import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { warehouseApi } from "@/features/warehouse/api";
import {
  getChangedMoneyValue,
  getSignedStockQuantity,
} from "@/features/warehouse/lib/service.ts";
import {
  type StockMovementFormValues,
  type StockMovementSchema,
  stockMovementSchema,
} from "@/features/warehouse/lib/stock.schema.ts";
import type { ManualStockReason } from "@/features/warehouse/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";
import { isApiError, notifyError } from "@/shared/lib/errors/services.ts";

const FIELD_MAP = {
  location_id: "locationId",
  purchase_price: "purchasePrice",
} as const;

type UseStockMovementFormParams = {
  itemId: number;
  reason: ManualStockReason;
  defaultLocationId: number | null;
  /** The item's current purchase price — prefills the form. */
  purchasePrice: string | null;
  onSuccess: () => void;
};

type UseStockMovementFormReturn = {
  methods: UseFormReturn<StockMovementFormValues, unknown, StockMovementSchema>;
  onSubmit: (values: StockMovementSchema) => void;
  isPending: boolean;
};

export const useStockMovementForm = ({
  itemId,
  reason,
  defaultLocationId,
  purchasePrice,
  onSuccess,
}: UseStockMovementFormParams): UseStockMovementFormReturn => {
  const queryClient = useQueryClient();

  const methods = useForm<
    StockMovementFormValues,
    unknown,
    StockMovementSchema
  >({
    resolver: zodResolver(stockMovementSchema()),
    defaultValues: {
      reason,
      locationId: defaultLocationId ?? undefined,
      quantity: "",
      note: "",
      purchasePrice: purchasePrice ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: StockMovementSchema) =>
      warehouseApi.changeStock(itemId, {
        ...values,
        quantity: getSignedStockQuantity(values.reason, values.quantity),
        purchasePrice: getChangedMoneyValue(
          values.purchasePrice,
          purchasePrice,
        ),
      }),
    onSuccess: (item) => {
      toast.success(i18next.t("warehouse.stock.success"));
      queryClient.setQueryData(queryKeys.warehouse.item(itemId), item);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.warehouse.all,
      });
      onSuccess();
    },
    onError: (error) => {
      if (isApiError(error) && error.status === 422) {
        handleFormError(error, methods.setError, { fieldMap: FIELD_MAP });
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

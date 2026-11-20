import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, type UseFormReturn } from "react-hook-form";

import type { NewQuickOrderItemSchema } from "@/features/quick-orders/lib/schema.ts";
import {
  type DonorSaleFormValues,
  type DonorSaleSchema,
  donorSaleSchema,
} from "@/features/warehouse/lib/orderActions.schema.ts";
import {
  getDonorSalePurchase,
  mapDonorSalePartRows,
} from "@/features/warehouse/lib/service.ts";
import type { DonorDetail } from "@/features/warehouse/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseQuickOrderDonorLineParams = {
  onSave: (line: NewQuickOrderItemSchema) => void;
};

type UseQuickOrderDonorLineReturn = {
  methods: UseFormReturn<DonorSaleFormValues, unknown, DonorSaleSchema>;
  onSubmit: (values: DonorSaleSchema) => void;
};

/**
 * "Sell donor" in a quick sale (e.g. to a marketplace): nothing is sent yet —
 * the donor becomes a draft line, sold when the quick sale is created.
 */
export const useQuickOrderDonorLine = ({
  onSave,
}: UseQuickOrderDonorLineParams): UseQuickOrderDonorLineReturn => {
  const queryClient = useQueryClient();
  const methods = useForm<DonorSaleFormValues, unknown, DonorSaleSchema>({
    resolver: zodResolver(donorSaleSchema()),
    defaultValues: { donorId: null, donorLabel: "", parts: [], price: "" },
  });

  const onSubmit = (values: DonorSaleSchema) => {
    // Loaded by the picker when the donor was chosen.
    const donor = queryClient.getQueryData<DonorDetail>(
      queryKeys.warehouse.donor(values.donorId),
    );
    onSave({
      name: values.donorLabel,
      price: values.price,
      // A donor is one physical device.
      quantity: 1,
      // Shown in the draft only — the backend computes the purchase itself.
      purchasePrice: donor
        ? getDonorSalePurchase(values.parts, donor.economics.totalCost)
        : "",
      costPrice: "",
      warehouseItemId: null,
      donorPartId: null,
      warehouseDonorId: values.donorId,
      donorParts: mapDonorSalePartRows(values.parts),
    });
  };

  return { methods, onSubmit };
};

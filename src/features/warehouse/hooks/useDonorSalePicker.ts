import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormContext, useWatch } from "react-hook-form";

import { warehouseApi } from "@/features/warehouse/api";
import type { DonorSaleFormValues } from "@/features/warehouse/lib/orderActions.schema.ts";
import {
  type DonorSalePartRow,
  getDonorSalePartRows,
  getDonorSalePurchase,
} from "@/features/warehouse/lib/service.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { notifyError } from "@/shared/lib/errors/services.ts";

type UseDonorSalePickerReturn = {
  donorLabel: string;
  parts: DonorSalePartRow[];
  /** Null until a donor is picked and its card is loaded. */
  purchase: string | null;
  isLoadingDonor: boolean;
  selectDonor: (donorId: number, label: string) => void;
  typeDonor: (text: string) => void;
};

/**
 * Donor + parts part of the "sell donor" forms (order and quick sale) — must
 * run inside their FormProvider. Picking a donor loads its card and lists the
 * parts still on the shelf, none picked (= the whole donor goes).
 */
export const useDonorSalePicker = (): UseDonorSalePickerReturn => {
  const queryClient = useQueryClient();
  const { control, setValue, getValues, clearErrors } =
    useFormContext<DonorSaleFormValues>();
  const [donorId, donorLabel, parts] = useWatch({
    control,
    name: ["donorId", "donorLabel", "parts"],
  });

  const { data: donor, isFetching } = useQuery({
    queryKey: queryKeys.warehouse.donor(donorId ?? 0),
    queryFn: () => warehouseApi.getDonor(donorId ?? 0),
    enabled: donorId !== null,
  });

  const selectDonor = (id: number, label: string) => {
    setValue("donorLabel", label);
    setValue("donorId", id, { shouldValidate: true });
    setValue("parts", []);
    clearErrors("parts");
    // The rows are filled once, on pick — not on every refetch, so a typed
    // cost price or a ticked part is never overwritten under the manager.
    queryClient
      .fetchQuery({
        queryKey: queryKeys.warehouse.donor(id),
        queryFn: () => warehouseApi.getDonor(id),
      })
      .then((card) => {
        if (getValues("donorId") === id) {
          setValue("parts", getDonorSalePartRows(card.parts));
        }
      })
      .catch(notifyError);
  };

  const typeDonor = (text: string) => {
    setValue("donorLabel", text);
    setValue("donorId", null);
    setValue("parts", []);
  };

  return {
    donorLabel,
    parts,
    purchase:
      donorId !== null && donor
        ? getDonorSalePurchase(parts, donor.economics.totalCost)
        : null,
    isLoadingDonor: donorId !== null && isFetching && !donor,
    selectDonor,
    typeDonor,
  };
};

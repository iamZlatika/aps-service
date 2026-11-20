import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { warehouseApi } from "@/features/warehouse/api";
import {
  type DonorInvestmentFormValues,
  type DonorInvestmentSchema,
  donorInvestmentSchema,
  INVESTMENT_MODES,
} from "@/features/warehouse/lib/investment.schema.ts";
import { mapInvestmentFormToNew } from "@/features/warehouse/lib/service.ts";
import type { DonorDetail } from "@/features/warehouse/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";
import { isApiError, notifyError } from "@/shared/lib/errors/services.ts";

const FIELD_MAP = {
  warehouse_item_id: "itemId",
  quantity: "quantity",
  name: "name",
  amount: "amount",
  note: "note",
} as const;

/**
 * Both endpoints return the full donor card: put it into the cache, and
 * refresh the rest of the warehouse — a warehouse line moves item stock.
 */
function useApplyDonorCard(donorId: number): (donor: DonorDetail) => void {
  const queryClient = useQueryClient();
  return (donor) => {
    queryClient.setQueryData(queryKeys.warehouse.donor(donorId), donor);
    void queryClient.invalidateQueries({
      queryKey: queryKeys.warehouse.all,
      predicate: (query) =>
        query.queryKey[1] !== "donor" || query.queryKey[2] !== donorId,
    });
  };
}

type UseAddDonorInvestmentParams = {
  donorId: number;
  onSuccess: () => void;
};

type UseAddDonorInvestmentReturn = {
  methods: UseFormReturn<
    DonorInvestmentFormValues,
    unknown,
    DonorInvestmentSchema
  >;
  onSubmit: (values: DonorInvestmentSchema) => void;
  isPending: boolean;
};

export const useAddDonorInvestment = ({
  donorId,
  onSuccess,
}: UseAddDonorInvestmentParams): UseAddDonorInvestmentReturn => {
  const applyDonorCard = useApplyDonorCard(donorId);
  const methods = useForm<
    DonorInvestmentFormValues,
    unknown,
    DonorInvestmentSchema
  >({
    resolver: zodResolver(donorInvestmentSchema()),
    defaultValues: {
      mode: INVESTMENT_MODES.WAREHOUSE,
      itemId: null,
      itemLabel: "",
      quantity: "1",
      name: "",
      amount: "",
      note: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: DonorInvestmentSchema) =>
      warehouseApi.addDonorInvestment(donorId, mapInvestmentFormToNew(values)),
    onSuccess: (donor) => {
      toast.success(i18next.t("warehouse.investments.success"));
      applyDonorCard(donor);
      onSuccess();
    },
    onError: (error) => {
      // 422 `donor_sold_no_investments` has no field — it lands on root.
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

type UseDeleteDonorInvestmentReturn = {
  onDelete: (investmentId: number) => void;
  isPending: boolean;
};

/** A warehouse line gives its stock back. */
export const useDeleteDonorInvestment = (
  donorId: number,
): UseDeleteDonorInvestmentReturn => {
  const applyDonorCard = useApplyDonorCard(donorId);
  const mutation = useMutation({
    mutationFn: (investmentId: number) =>
      warehouseApi.deleteDonorInvestment(donorId, investmentId),
    onSuccess: (donor) => {
      toast.success(i18next.t("warehouse.investments.deleteSuccess"));
      applyDonorCard(donor);
    },
  });

  return { onDelete: mutation.mutate, isPending: mutation.isPending };
};

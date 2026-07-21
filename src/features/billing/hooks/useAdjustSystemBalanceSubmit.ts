import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseFormSetError } from "react-hook-form";

import { billingApi } from "@/features/billing/api";
import type {
  AdjustSystemBalanceFormValues,
  AdjustSystemBalanceSchema,
} from "@/features/billing/lib/schema.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

type UseAdjustSystemBalanceSubmitReturn = {
  onSubmit: (
    values: AdjustSystemBalanceSchema,
    setError: UseFormSetError<AdjustSystemBalanceFormValues>,
  ) => Promise<void>;
  isPending: boolean;
};

export const useAdjustSystemBalanceSubmit = (
  onSuccess?: () => void,
): UseAdjustSystemBalanceSubmitReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { amount: string; description: string }) =>
      billingApi.adjustSystemBalance(data),
    // handleFormError below always surfaces the error (field-level or root)
    // inside the modal, so the global toast in queryClient's mutationCache
    // would just be a redundant, confusing duplicate.
    meta: { silent: true },
    onSuccess: () => {
      onSuccess?.();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.billing.systemBalance(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.billing.allTransactions(),
      });
    },
  });

  const onSubmit = async (
    values: AdjustSystemBalanceSchema,
    setError: UseFormSetError<AdjustSystemBalanceFormValues>,
  ): Promise<void> => {
    try {
      await mutation.mutateAsync({
        amount: `-${values.amount}`,
        description: values.description,
      });
    } catch (error) {
      handleFormError(error, setError);
    }
  };

  return { onSubmit, isPending: mutation.isPending };
};

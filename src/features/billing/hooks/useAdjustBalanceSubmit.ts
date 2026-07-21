import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseFormSetError } from "react-hook-form";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { billingApi } from "@/features/billing/api";
import { BILLING_DIRECTIONS } from "@/features/billing/lib/constants.ts";
import type {
  AdjustBalanceFormValues,
  AdjustBalanceSchema,
} from "@/features/billing/lib/schema.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

type UseAdjustBalanceSubmitReturn = {
  onSubmit: (
    values: AdjustBalanceSchema,
    setError: UseFormSetError<AdjustBalanceFormValues>,
  ) => Promise<void>;
  isPending: boolean;
};

export const useAdjustBalanceSubmit = (
  onSuccess?: () => void,
): UseAdjustBalanceSubmitReturn => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const mutation = useMutation({
    mutationFn: (data: {
      userId: number;
      amount: string;
      description: string;
    }) => billingApi.createTransaction(data),
    // handleFormError below always surfaces the error (field-level or root)
    // inside the modal, so the global toast in queryClient's mutationCache
    // would just be a redundant, confusing duplicate.
    meta: { silent: true },
    onSuccess: (transaction) => {
      onSuccess?.();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.billing.balances(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.billing.allTransactions(),
      });
      if (transaction.user?.id === currentUser?.id) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
      }
    },
  });

  const onSubmit = async (
    values: AdjustBalanceSchema,
    setError: UseFormSetError<AdjustBalanceFormValues>,
  ): Promise<void> => {
    const signedAmount =
      values.direction === BILLING_DIRECTIONS.DEDUCT
        ? `-${values.amount}`
        : values.amount;
    try {
      await mutation.mutateAsync({
        userId: values.userId,
        amount: signedAmount,
        description: values.description,
      });
    } catch (error) {
      handleFormError(error, setError, { fieldMap: { user_id: "userId" } });
    }
  };

  return { onSubmit, isPending: mutation.isPending };
};

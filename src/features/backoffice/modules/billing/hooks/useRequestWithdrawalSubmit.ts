import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseFormSetError } from "react-hook-form";

import { billingApi } from "@/features/backoffice/modules/billing/api";
import type {
  RequestWithdrawalFormValues,
  RequestWithdrawalSchema,
} from "@/features/backoffice/modules/billing/lib/schema.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

type UseRequestWithdrawalSubmitReturn = {
  onSubmit: (
    values: RequestWithdrawalSchema,
    setError: UseFormSetError<RequestWithdrawalFormValues>,
  ) => Promise<void>;
  isPending: boolean;
};

export const useRequestWithdrawalSubmit = (
  onSuccess?: () => void,
): UseRequestWithdrawalSubmitReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { amount: string; description?: string }) =>
      billingApi.requestWithdrawal(data),
    // handleFormError below always surfaces the error (field-level or root)
    // inside the modal, so the global toast in queryClient's mutationCache
    // would just be a redundant, confusing duplicate.
    meta: { silent: true },
    onSuccess: () => {
      onSuccess?.();
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.billing.myTransactions(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.billing.withdrawalRequests(),
      });
    },
  });

  const onSubmit = async (
    values: RequestWithdrawalSchema,
    setError: UseFormSetError<RequestWithdrawalFormValues>,
  ): Promise<void> => {
    try {
      await mutation.mutateAsync({
        amount: values.amount,
        description: values.description,
      });
    } catch (error) {
      handleFormError(error, setError);
    }
  };

  return { onSubmit, isPending: mutation.isPending };
};

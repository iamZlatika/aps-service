import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseFormSetError } from "react-hook-form";

import { referralsApi } from "@/features/backoffice/modules/referrals/api";
import { REFERRAL_DIRECTIONS } from "@/features/backoffice/modules/referrals/lib/constants.ts";
import type {
  AdjustReferralBalanceFormValues,
  AdjustReferralBalanceSchema,
} from "@/features/backoffice/modules/referrals/lib/schema.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

type UseAdjustReferralBalanceSubmitReturn = {
  onSubmit: (
    referralId: number,
    values: AdjustReferralBalanceSchema,
    setError: UseFormSetError<AdjustReferralBalanceFormValues>,
  ) => Promise<void>;
  isPending: boolean;
};

export const useAdjustReferralBalanceSubmit = (
  onSuccess?: () => void,
): UseAdjustReferralBalanceSubmitReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      id,
      amount,
      description,
    }: {
      id: number;
      amount: string;
      description: string;
    }) => referralsApi.adjustBalance(id, { amount, description }),
    meta: { silent: true },
    onSuccess: (_data, variables) => {
      onSuccess?.();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.referrals.list(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.referrals.transactions(variables.id)(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.referrals.detail(variables.id),
      });
    },
  });

  const onSubmit = async (
    referralId: number,
    values: AdjustReferralBalanceSchema,
    setError: UseFormSetError<AdjustReferralBalanceFormValues>,
  ): Promise<void> => {
    const signedAmount =
      values.direction === REFERRAL_DIRECTIONS.DEDUCT
        ? `-${values.amount}`
        : values.amount;
    try {
      await mutation.mutateAsync({
        id: referralId,
        amount: signedAmount,
        description: values.description,
      });
    } catch (error) {
      handleFormError(error, setError);
    }
  };

  return { onSubmit, isPending: mutation.isPending };
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseFormSetError } from "react-hook-form";

import { referralsApi } from "@/features/referrals/api";
import type {
  EditReferralFormValues,
  EditReferralSchema,
} from "@/features/referrals/lib/schema.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

type UseEditReferralReturn = {
  onSubmit: (
    referralId: number,
    values: EditReferralSchema,
    setError: UseFormSetError<EditReferralFormValues>,
  ) => Promise<void>;
  isPending: boolean;
};

export const useEditReferral = (
  onSuccess?: () => void,
): UseEditReferralReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { commissionPercent: number };
    }) => referralsApi.update(id, data),
    meta: { silent: true },
    onSuccess: (referral) => {
      onSuccess?.();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.referrals.list(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.referrals.detail(referral.id),
      });
    },
  });

  const onSubmit = async (
    referralId: number,
    values: EditReferralSchema,
    setError: UseFormSetError<EditReferralFormValues>,
  ): Promise<void> => {
    try {
      await mutation.mutateAsync({
        id: referralId,
        data: {
          commissionPercent: values.commissionPercent,
        },
      });
    } catch (error) {
      handleFormError(error, setError, {
        fieldMap: { commission_percent: "commissionPercent" },
      });
    }
  };

  return { onSubmit, isPending: mutation.isPending };
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import type { UseFormSetError } from "react-hook-form";

import { referralsApi } from "@/features/backoffice/modules/referrals/api";
import type {
  MakeReferralFormValues,
  MakeReferralSchema,
} from "@/features/backoffice/modules/referrals/lib/schema.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

type UseMakeReferralReturn = {
  onSubmit: (
    values: MakeReferralSchema,
    setError: UseFormSetError<MakeReferralFormValues>,
  ) => Promise<void>;
  isPending: boolean;
};

export const useMakeReferral = (
  onSuccess?: () => void,
): UseMakeReferralReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: referralsApi.create,
    // handleFormError below always surfaces the error inside the dialog, so the
    // global toast in queryClient's mutationCache would be a redundant duplicate.
    meta: { silent: true },
    onSuccess: (referral) => {
      onSuccess?.();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.referrals.list(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.customers.detail(referral.customer.id),
      });
    },
  });

  const onSubmit = async (
    values: MakeReferralSchema,
    setError: UseFormSetError<MakeReferralFormValues>,
  ): Promise<void> => {
    try {
      await mutation.mutateAsync({
        customerId: values.customerId,
        commissionPercent: values.commissionPercent,
      });
    } catch (error) {
      handleFormError(error, setError, {
        fieldMap: {
          customer_id: "customerId",
          commission_percent: "commissionPercent",
        },
        messageMap: {
          "The customer id has already been taken.": i18next.t(
            "referrals.make_referral_modal.customer_already_referral",
          ),
        },
      });
    }
  };

  return { onSubmit, isPending: mutation.isPending };
};

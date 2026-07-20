import { useMutation, useQueryClient } from "@tanstack/react-query";

import { referralsApi } from "@/features/backoffice/modules/referrals/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseDemoteReferralReturn = {
  demote: (id: number) => void;
  isPending: boolean;
};

export const useDemoteReferral = (
  onSuccess?: () => void,
): UseDemoteReferralReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => referralsApi.demote(id),
    onSuccess: () => {
      onSuccess?.();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.referrals.list(),
      });
    },
  });

  return { demote: mutation.mutate, isPending: mutation.isPending };
};

import { useQuery } from "@tanstack/react-query";

import { billingApi } from "@/features/billing/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UsePendingWithdrawalsCountReturn = {
  count: number;
  isLoading: boolean;
};

export const usePendingWithdrawalsCount =
  (): UsePendingWithdrawalsCountReturn => {
    const { data, isLoading } = useQuery({
      queryKey: queryKeys.billing.withdrawalRequests(1, 1),
      queryFn: () => billingApi.withdrawalRequests.getAll(1, 1),
    });

    return { count: data?.meta.total ?? 0, isLoading };
  };

import { useQuery } from "@tanstack/react-query";

import { billingApi } from "@/features/backoffice/modules/billing/api";
import { type SystemBalance } from "@/features/backoffice/modules/billing/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseSystemBalanceReturn = {
  systemBalance: SystemBalance | undefined;
  isLoading: boolean;
};

export const useSystemBalance = (): UseSystemBalanceReturn => {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.billing.systemBalance(),
    queryFn: billingApi.getSystemBalance,
  });

  return { systemBalance: data, isLoading };
};

import { useQuery } from "@tanstack/react-query";

import { quickOrdersApi } from "@/features/quick-orders/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";

export const useQuickOrder = (quickOrderId: number | null) => {
  const {
    data: quickOrder,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.quickOrders.detail(quickOrderId!),
    queryFn: () => quickOrdersApi.getQuickOrder(quickOrderId!),
    enabled: quickOrderId !== null,
  });

  return { quickOrder, isLoading, isFetching, isError, error, refetch };
};

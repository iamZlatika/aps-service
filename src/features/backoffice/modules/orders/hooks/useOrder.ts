import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ordersApi } from "@/features/backoffice/modules/orders/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";

export const useOrder = (orderId: number) => {
  const {
    data: selectedOrder,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: () => ordersApi.getOrder(orderId),
    placeholderData: keepPreviousData,
  });

  return { selectedOrder, isLoading, isFetching, isError, error, refetch };
};

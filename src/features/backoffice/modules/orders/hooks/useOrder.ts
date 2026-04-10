import { useQuery } from "@tanstack/react-query";

import { ordersApi } from "@/features/backoffice/modules/orders/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";

export const useOrder = (orderId: number | null) => {
  const { data: selectedOrder, isLoading } = useQuery({
    queryKey: queryKeys.orders.detail(orderId!),
    queryFn: () => ordersApi.getOrder(orderId!),
    enabled: orderId !== null,
  });

  return { selectedOrder, isLoading };
};

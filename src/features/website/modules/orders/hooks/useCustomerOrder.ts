import { useQuery } from "@tanstack/react-query";

import { customerOrdersApi } from "@/features/website/modules/orders/api";
import { type OrderDetail } from "@/features/website/modules/orders/types";
import { queryKeys } from "@/shared/api/queryKeys";

type UseCustomerOrderResult = {
  order: OrderDetail | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
};

export const useCustomerOrder = (id: number): UseCustomerOrderResult => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.customer.orderDetail(id),
    queryFn: () => customerOrdersApi.getOrder(id),
  });

  return { order: data, isLoading, isError, error, refetch };
};

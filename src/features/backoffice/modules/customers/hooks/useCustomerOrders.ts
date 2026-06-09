import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { ordersApi } from "@/features/backoffice/modules/orders/api";
import type { Order } from "@/features/backoffice/modules/orders/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseCustomerOrdersResult = {
  orders: Order[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  lastPage: number;
  setPage: (page: number) => void;
};

export const useCustomerOrders = (
  customerId: number,
): UseCustomerOrdersResult => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.orders.byCustomer(customerId, page),
    queryFn: () =>
      ordersApi.getAll(page, 10, undefined, undefined, {
        customer_id: String(customerId),
      }),
  });

  return {
    orders: data?.items ?? [],
    isLoading,
    isError,
    page,
    lastPage: data?.meta.lastPage ?? 1,
    setPage,
  };
};

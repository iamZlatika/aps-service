import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { customerOrdersApi } from "@/features/website/modules/orders/api";
import {
  type OrderListItem,
  type OrdersListMeta,
} from "@/features/website/modules/orders/types";
import { queryKeys } from "@/shared/api/queryKeys";

const PER_PAGE = 10;

type UseCustomerOrdersResult = {
  orders: OrderListItem[];
  meta: OrdersListMeta | undefined;
  page: number;
  setPage: (page: number) => void;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
};

export const useCustomerOrders = (): UseCustomerOrdersResult => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.customer.orders(page),
    queryFn: () => customerOrdersApi.getAll(page, PER_PAGE),
  });

  return {
    orders: data?.items ?? [],
    meta: data?.meta,
    page,
    setPage,
    isLoading,
    isError,
    error,
    refetch,
  };
};

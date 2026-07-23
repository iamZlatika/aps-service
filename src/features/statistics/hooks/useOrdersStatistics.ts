import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/api/queryKeys.ts";

import { statisticsApi } from "../api";
import type { StatisticsFilters } from "../types.ts";

export const useOrdersStatistics = (filters: StatisticsFilters) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.statistics.orders(filters),
    queryFn: () => statisticsApi.getOrders(filters),
    enabled: Boolean(filters.from && filters.to),
    placeholderData: keepPreviousData,
  });

  return { orders: data, isLoading, isError, error, refetch };
};

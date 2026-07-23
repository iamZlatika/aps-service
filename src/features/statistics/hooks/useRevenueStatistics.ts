import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/api/queryKeys.ts";

import { statisticsApi } from "../api";
import type { Granularity, StatisticsFilters } from "../types.ts";

export const useRevenueStatistics = (
  filters: StatisticsFilters,
  granularity: Granularity | undefined,
) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.statistics.revenue(filters, granularity),
    queryFn: () => statisticsApi.getRevenue(filters, granularity),
    enabled: Boolean(filters.from && filters.to),
    placeholderData: keepPreviousData,
  });

  return { revenue: data, isLoading, isError, error, refetch };
};

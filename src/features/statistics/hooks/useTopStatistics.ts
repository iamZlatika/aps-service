import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/api/queryKeys.ts";

import { statisticsApi } from "../api";
import type { StatisticsFilters } from "../types.ts";

export const useTopStatistics = (filters: StatisticsFilters, limit: number) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.statistics.top(filters, limit),
    queryFn: () => statisticsApi.getTop(filters, limit),
    enabled: Boolean(filters.from && filters.to),
    placeholderData: keepPreviousData,
  });

  return { top: data, isLoading, isError, error, refetch };
};

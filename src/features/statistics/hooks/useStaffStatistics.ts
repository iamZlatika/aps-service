import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/api/queryKeys.ts";

import { statisticsApi } from "../api";
import type { StatisticsFilters } from "../types.ts";

export const useStaffStatistics = (filters: StatisticsFilters) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.statistics.staff(filters),
    queryFn: () => statisticsApi.getStaff(filters),
    enabled: Boolean(filters.from && filters.to),
    placeholderData: keepPreviousData,
  });

  return { staff: data, isLoading, isError, error, refetch };
};

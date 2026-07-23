import { useQuery } from "@tanstack/react-query";

import { locationApi } from "@/features/dictionaries/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";

export const useStatisticsLocations = () => {
  const { data } = useQuery({
    queryKey: queryKeys.dictionaries.locations(),
    queryFn: () => locationApi.getAll(1, 100),
  });

  return { locations: data?.items ?? [] };
};

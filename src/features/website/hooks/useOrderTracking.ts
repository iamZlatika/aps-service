import { useQuery } from "@tanstack/react-query";

import { websiteApi } from "@/features/website/api";
import { queryKeys } from "@/shared/api/queryKeys";

export const useOrderTracking = (token: string) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.tracking.detail(token),
    queryFn: () => websiteApi.getOrderTracking(token),
  });

  return { track: data, isLoading, isError, error, refetch };
};

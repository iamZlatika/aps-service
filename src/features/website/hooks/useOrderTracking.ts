import { useQuery } from "@tanstack/react-query";

import { websiteApi } from "@/features/website/api";
import { type Track } from "@/features/website/types";
import { queryKeys } from "@/shared/api/queryKeys";

type UseOrderTrackingResult = {
  track: Track | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
};

export const useOrderTracking = (token: string): UseOrderTrackingResult => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.tracking.detail(token),
    queryFn: () => websiteApi.getOrderTracking(token),
  });

  return { track: data, isLoading, isError, error, refetch };
};

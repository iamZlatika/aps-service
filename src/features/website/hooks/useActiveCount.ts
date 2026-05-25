import { useQuery } from "@tanstack/react-query";

import { websiteApi } from "@/features/website/api";
import { queryKeys } from "@/shared/api/queryKeys";

export const useActiveCount = (): { activeCount: number | undefined } => {
  const { data } = useQuery({
    queryKey: queryKeys.website.activeCount(),
    queryFn: () => websiteApi.getActiveCount(),
  });

  return { activeCount: data };
};

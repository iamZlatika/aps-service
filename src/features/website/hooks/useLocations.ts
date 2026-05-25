import { useQuery } from "@tanstack/react-query";

import { websiteApi } from "@/features/website/api";
import { queryKeys } from "@/shared/api/queryKeys";
import { type Location } from "@/shared/types";

export const useLocations = (): { locations: Location[] } => {
  const { data } = useQuery({
    queryKey: queryKeys.website.locations(),
    queryFn: () => websiteApi.getLocationsInfo(),
  });

  return { locations: data ?? [] };
};

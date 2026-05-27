import { useSuspenseQuery } from "@tanstack/react-query";

import { websiteApi } from "@/features/website/api";
import { queryKeys } from "@/shared/api/queryKeys";
import { type Location } from "@/shared/types";

type UseLocationsResult = {
  locations: Location[];
};

export const useLocations = (): UseLocationsResult => {
  const { data } = useSuspenseQuery({
    queryKey: queryKeys.website.locations(),
    queryFn: () => websiteApi.getLocationsInfo(),
  });

  return { locations: data };
};

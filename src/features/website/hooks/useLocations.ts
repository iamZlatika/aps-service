import { useSuspenseQuery } from "@tanstack/react-query";

import { type Location } from "@/entities/location/types";
import { websiteApi } from "@/features/website/api";
import { queryKeys } from "@/shared/api/queryKeys";

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

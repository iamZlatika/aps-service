import { useQuery } from "@tanstack/react-query";

import { websiteApi } from "@/features/website/api";
import { queryKeys } from "@/shared/api/queryKeys";
import { type Location } from "@/shared/types";

type UseLocationsResult = {
  locations: Location[];
  isPending: boolean;
  isError: boolean;
  error: unknown;
};

export const useLocations = (): UseLocationsResult => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.website.locations(),
    queryFn: () => websiteApi.getLocationsInfo(),
  });

  return { locations: data ?? [], isPending, isError, error };
};

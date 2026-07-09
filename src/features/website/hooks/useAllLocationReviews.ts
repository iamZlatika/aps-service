import { useSuspenseQueries } from "@tanstack/react-query";

import { type Location } from "@/entities/location/types";
import { websiteApi } from "@/features/website/api";
import { type Review } from "@/features/website/types";
import { queryKeys } from "@/shared/api/queryKeys";

export type LocationReviews = {
  locationId: number;
  reviews: Review[];
};

export const useAllLocationReviews = (
  locations: Location[],
): LocationReviews[] => {
  const results = useSuspenseQueries({
    queries: locations.map((location) => ({
      queryKey: queryKeys.website.reviews(location.id),
      queryFn: () => websiteApi.getReviews(location.id),
    })),
  });

  return locations.map((location, index) => ({
    locationId: location.id,
    reviews: results[index].data,
  }));
};

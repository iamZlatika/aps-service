import { useQuery } from "@tanstack/react-query";

import { websiteApi } from "@/features/website/api";
import { type LandingData } from "@/features/website/types";
import { queryKeys } from "@/shared/api/queryKeys";

type UseLandingResult = {
  landing: LandingData | undefined;
};

export const useLanding = (): UseLandingResult => {
  const { data } = useQuery({
    queryKey: queryKeys.website.landing(),
    queryFn: () => websiteApi.getLanding(),
  });

  return { landing: data };
};

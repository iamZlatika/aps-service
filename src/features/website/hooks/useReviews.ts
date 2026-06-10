import { useSuspenseQuery } from "@tanstack/react-query";

import { websiteApi } from "@/features/website/api";
import { type Review } from "@/features/website/types";
import { queryKeys } from "@/shared/api/queryKeys";

type UseReviewsResult = {
  reviews: Review[];
};

export const useReviews = (): UseReviewsResult => {
  const { data } = useSuspenseQuery({
    queryKey: queryKeys.website.reviews(),
    queryFn: () => websiteApi.getReviews(),
  });

  return { reviews: data };
};

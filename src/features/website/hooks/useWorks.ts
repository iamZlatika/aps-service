import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { type Work } from "@/entities/work/types";
import { websiteApi } from "@/features/website/api";
import { queryKeys } from "@/shared/api/queryKeys";

type UseWorksResult = {
  works: Work[];
  isLoadingMore: boolean;
};

export const useWorks = (): UseWorksResult => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: queryKeys.website.works(),
      queryFn: ({ pageParam }) => websiteApi.getWorksPage(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage, _, lastPageParam) =>
        lastPageParam < lastPage.lastPage ? lastPageParam + 1 : undefined,
    });

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    works: data.pages.flatMap((p) => p.items),
    isLoadingMore: isFetchingNextPage,
  };
};

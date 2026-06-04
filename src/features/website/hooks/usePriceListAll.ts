import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import { type PriceListItem } from "@/entities/price-list/types";
import { websiteApi } from "@/features/website/api";
import { queryKeys } from "@/shared/api/queryKeys";

type UsePriceListAllResult = {
  priceList: PriceListItem[];
  hasNextPage: boolean;
  isLoadingMore: boolean;
  fetchNextPage: () => void;
};

export const usePriceListAll = (): UsePriceListAllResult => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: queryKeys.website.priceListAll(),
      queryFn: ({ pageParam }) => websiteApi.getPriceListPage(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage, _, lastPageParam) =>
        lastPageParam < lastPage.lastPage ? lastPageParam + 1 : undefined,
    });

  return {
    priceList: data.pages.flatMap((p) => p.items),
    hasNextPage,
    isLoadingMore: isFetchingNextPage,
    fetchNextPage,
  };
};

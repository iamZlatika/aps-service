import { useSuspenseQuery } from "@tanstack/react-query";

import { type PriceListItem } from "@/entities/price-list/types";
import { websiteApi } from "@/features/website/api";
import { queryKeys } from "@/shared/api/queryKeys";

type UsePriceListResult = {
  priceList: PriceListItem[];
};

export const usePriceList = (categories: string[]): UsePriceListResult => {
  const { data } = useSuspenseQuery({
    queryKey: queryKeys.website.priceList(categories),
    queryFn: () => websiteApi.getPriceList(categories),
  });

  return { priceList: data };
};

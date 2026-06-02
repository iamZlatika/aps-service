import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { priceListApi } from "@/features/backoffice/modules/dictionaries/api";
import type { PriceListItem, PaginationMeta } from "@/features/backoffice/modules/dictionaries/types";
import { queryKeys } from "@/shared/api/queryKeys";

const PER_PAGE = 25;

type UsePriceListReturn = {
  items: PriceListItem[];
  meta: PaginationMeta | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  page: number;
  setPage: (page: number) => void;
};

export const usePriceList = (): UsePriceListReturn => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.dictionaries.priceList(page, PER_PAGE),
    queryFn: () => priceListApi.getAll(page, PER_PAGE),
  });

  return {
    items: data?.items ?? [],
    meta: data?.meta,
    isLoading,
    isError,
    error,
    page,
    setPage,
  };
};

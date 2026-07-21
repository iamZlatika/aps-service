import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

import { getPageNumbers } from "@/shared/lib/pagination.ts";
import { useFilterParams } from "@/widgets/table/hooks/useFilterParams.ts";
import { usePageParam } from "@/widgets/table/hooks/usePageParam.ts";
import { usePerPage } from "@/widgets/table/hooks/usePerPage.ts";
import type {
  SortState,
  SortType,
} from "@/widgets/table/hooks/useSortParams.ts";
import { useSortParams } from "@/widgets/table/hooks/useSortParams.ts";
import { sanitizeFilters } from "@/widgets/table/lib/sanitizeFilters.ts";
import type { BaseItem, SmartTableApi } from "@/widgets/table/models/types.ts";

type UseSmartTableParams<T extends BaseItem = BaseItem> = {
  api: SmartTableApi<T>;
  queryKeyFn: (
    page: number,
    perPage: number,
    sortColumn: string | null,
    sortType: SortType,
    filters: Record<string, string>,
  ) => readonly unknown[];
  columns: { field: string; filterable?: boolean }[];
  searchField: string;
  tableKey: string;
  extraFilterKeys?: string[];
};

type UseSmartTableReturn<T extends BaseItem> = {
  data: {
    items: T[] | undefined;
    isLoading: boolean;
    isRefetching: boolean;
    isError: boolean;
    refetch: () => void;
  };
  pagination: {
    page: number;
    setPage: (value: number) => void;
    lastPage: number;
    pageNumbers: (number | "ellipsis")[];
    perPage: ReturnType<typeof usePerPage>["perPage"];
    perPageOptions: ReturnType<typeof usePerPage>["perPageOptions"];
    handlePerPageChange: (value: string) => void;
  };
  sort: {
    sort: SortState;
    toggleSort: (column: string) => void;
  };
  filters: {
    filters: Record<string, string>;
    setFilter: (fieldName: string, value: string) => void;
    resetFilters: () => void;
  };
};

export const useSmartTable = <T extends BaseItem>({
  api,
  queryKeyFn,
  columns,
  searchField,
  tableKey,
  extraFilterKeys,
}: UseSmartTableParams<T>): UseSmartTableReturn<T> => {
  const { page, setPage } = usePageParam();
  const { perPage, setPerPage, perPageOptions } = usePerPage(tableKey);
  const { sort, toggleSort } = useSortParams();

  const { filters, setFilter, resetFilters } = useFilterParams();
  const sanitized = sanitizeFilters(
    filters,
    columns,
    searchField,
    extraFilterKeys,
  );

  const queryKey = queryKeyFn(page, perPage, sort.column, sort.type, sanitized);

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey,
    queryFn: () => api.getAll(page, perPage, sort.column, sort.type, sanitized),
  });

  useEffect(() => {
    const invalidKeys = Object.keys(filters).filter((k) => !(k in sanitized));
    if (invalidKeys.length > 0) {
      invalidKeys.forEach((key) => setFilter(key, ""));
    }
  }, [filters, sanitized, setFilter]);

  const items = data?.items as T[] | undefined;
  const meta = data?.meta;
  const lastPage = meta?.lastPage ?? 1;
  const pageNumbers = getPageNumbers(page, lastPage);

  const handlePerPageChange = useCallback(
    (value: string) => {
      setPerPage(Number(value) as Parameters<typeof setPerPage>[0]);
      setPage(1);
    },
    [setPage, setPerPage],
  );

  return {
    data: {
      items,
      isLoading,
      isRefetching: isFetching && !isLoading,
      isError,
      refetch,
    },
    pagination: {
      page,
      setPage,
      lastPage,
      pageNumbers,
      perPage,
      perPageOptions,
      handlePerPageChange,
    },
    sort: {
      sort,
      toggleSort,
    },
    filters: {
      filters: sanitized,
      setFilter,
      resetFilters,
    },
  };
};

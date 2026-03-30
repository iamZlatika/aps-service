import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { useFilterParams } from "@/features/backoffice/widgets/table/hooks/useFilterParams.ts";
import { usePageParam } from "@/features/backoffice/widgets/table/hooks/usePageParam.ts";
import { usePerPage } from "@/features/backoffice/widgets/table/hooks/usePerPage.ts";
import type { SortType } from "@/features/backoffice/widgets/table/hooks/useSortParams.ts";
import { useSortParams } from "@/features/backoffice/widgets/table/hooks/useSortParams.ts";
import { sanitizeFilters } from "@/features/backoffice/widgets/table/lib/sanitizeFilters.ts";
import type {
  BaseItem,
  ColumnConfig,
  SmartTableApi,
} from "@/features/backoffice/widgets/table/models/types.ts";
import { getPageNumbers } from "@/shared/lib/pagination.ts";

interface UseSmartTableParams<T extends BaseItem = BaseItem> {
  api: SmartTableApi<T>;
  queryKeyFn: (
    page: number,
    perPage: number,
    sortColumn: string | null,
    sortType: SortType,
    filters: Record<string, string>,
  ) => readonly unknown[];
  columns: ColumnConfig[];
  searchField: string;
}

export const useSmartTable = <T extends BaseItem>({
  api,
  queryKeyFn,
  columns,
  searchField,
}: UseSmartTableParams<T>) => {
  const { page, setPage } = usePageParam();
  const { perPage, setPerPage, perPageOptions } = usePerPage();
  const { sort, toggleSort } = useSortParams();

  const { filters, setFilter, resetFilters } = useFilterParams();
  const sanitized = sanitizeFilters(filters, columns, searchField);

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

  const isOperationLoading = isLoading || isFetching;

  const items = data?.items as T[] | undefined;
  const meta = data?.meta;
  const lastPage = meta?.lastPage ?? 1;
  const pageNumbers = getPageNumbers(page, lastPage);

  const handlePerPageChange = (value: string) => {
    setPerPage(Number(value) as Parameters<typeof setPerPage>[0]);
    setPage(1);
  };

  return {
    data: {
      items,
      isOperationLoading,
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
    queryKey,
  };
};

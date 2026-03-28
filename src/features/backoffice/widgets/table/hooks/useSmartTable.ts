import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { type UseFormSetError } from "react-hook-form";

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

import { useTableActions } from "./useTableActions.ts";

interface UseSmartTableParams {
  api: SmartTableApi;
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

export const useSmartTable = ({
  api,
  queryKeyFn,
  columns,
  searchField,
}: UseSmartTableParams) => {
  const { page, setPage } = usePageParam();
  const { perPage, setPerPage, perPageOptions } = usePerPage();
  const { sort, toggleSort } = useSortParams();

  const { filters, setFilter, resetFilters } = useFilterParams();
  const sanitized = sanitizeFilters(filters, columns, searchField);
  const [editDialogItem, setEditDialogItem] = useState<BaseItem | null>(null);

  const editableFields = columns.filter((col) => col.key !== "id");
  const hasExtraFields = editableFields.length > 1;

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

  const { addModal, deleteModal, editing } = useTableActions(
    queryKey,
    (values) => api.create(values),
    (id) => api.remove(id),
    (id, values) => api.update(id, values),
  );

  const handleEditStart = useCallback(
    (item: BaseItem) => {
      if (hasExtraFields) {
        setEditDialogItem(item);
      } else {
        editing.start(item);
      }
    },
    [hasExtraFields, editing],
  );

  const handleEditDialogConfirm = useCallback(
    (
      values: Partial<BaseItem>,
      setError: UseFormSetError<Record<string, string>>,
    ) => {
      if (editDialogItem) {
        editing.save(editDialogItem.id, values, setError);
      }
    },
    [editDialogItem, editing],
  );

  const isOperationLoading =
    isLoading ||
    isFetching ||
    addModal.isPending ||
    deleteModal.isPending ||
    editing.isPending;

  const items = data?.items;
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
      columns,
      editableFields,
      hasExtraFields,
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
    actions: {
      addModal,
      deleteModal,
      editing,
      handleEditStart,
      editDialogItem,
      setEditDialogItem,
      handleEditDialogConfirm,
    },
  };
};

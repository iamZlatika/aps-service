import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { type UseFormSetError } from "react-hook-form";

import { usePerPage } from "@/shared/components/table/hooks/usePerPage.ts";
import type { SortType } from "@/shared/components/table/hooks/useSortParams.ts";
import { useSortParams } from "@/shared/components/table/hooks/useSortParams.ts";
import type {
  BaseItem,
  ColumnConfig,
  SmartTableApi,
} from "@/shared/components/table/types.ts";
import { getPageNumbers } from "@/shared/lib/pagination.ts";

import { useTableActions } from "./useTableActions.ts";

interface UseSmartTableParams {
  api: SmartTableApi;
  queryKeyFn: (
    page: number,
    perPage: number,
    sortColumn: string | null,
    sortType: SortType,
  ) => readonly (string | number | null)[];
  columns: ColumnConfig[];
}

export const useSmartTable = ({
  api,
  queryKeyFn,
  columns,
}: UseSmartTableParams) => {
  const [page, setPage] = useState(1);
  const { perPage, setPerPage, perPageOptions } = usePerPage();
  const { sort, toggleSort } = useSortParams();

  const [editDialogItem, setEditDialogItem] = useState<BaseItem | null>(null);

  const editableFields = columns.filter((col) => col.key !== "id");
  const hasExtraFields = editableFields.length > 1;

  const queryKey = queryKeyFn(page, perPage, sort.column, sort.type);

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey,
    queryFn: () => api.getAll(page, perPage, sort.column, sort.type),
  });

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
    items,
    columns,
    editableFields,
    hasExtraFields,
    isOperationLoading,
    isError,
    refetch,
    page,
    setPage,
    lastPage,
    pageNumbers,
    perPage,
    perPageOptions,
    handlePerPageChange,
    sort,
    toggleSort,
    addModal,
    deleteModal,
    editing,
    handleEditStart,
    editDialogItem,
    setEditDialogItem,
    handleEditDialogConfirm,
  };
};

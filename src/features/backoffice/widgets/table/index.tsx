import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import {
  SortableTableHeader,
  TableContent,
  TablePagination,
} from "@/features/backoffice/widgets/table/components";
import SearchFilter from "@/features/backoffice/widgets/table/components/filters/FilterInput.tsx";
import type { SortType } from "@/features/backoffice/widgets/table/hooks/useSortParams.ts";
import type {
  BaseItem,
  ColumnConfig,
  RenderRowActions,
  SmartTableApi,
} from "@/features/backoffice/widgets/table/models/types.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { Table, TableBody } from "@/shared/components/ui/table.tsx";

import { useSmartTable } from "./hooks/useSmartTable.ts";

interface SmartTableProps<T extends BaseItem = BaseItem> {
  titleKey: string;
  api: SmartTableApi<T>; // только getAll
  queryKeyFn: (
    page: number,
    perPage: number,
    sortColumn: string | null,
    sortType: SortType,
    filters: Record<string, string>,
  ) => readonly unknown[];
  columns: ColumnConfig<BaseItem>[];
  searchPlaceholder: string;
  searchField?: string;
  renderRowActions?: RenderRowActions<T>;
  headerActions?: ReactNode;
}

export const SmartTable = <T extends BaseItem>({
  titleKey,
  api,
  queryKeyFn,
  searchPlaceholder,
  searchField,
  columns,
  renderRowActions,
  headerActions,
}: SmartTableProps<T>) => {
  const { t } = useTranslation();

  const {
    data: { items, isOperationLoading, isError, refetch },
    pagination,
    sort: { sort, toggleSort },
    filters: { filters, setFilter },
  } = useSmartTable({
    api,
    queryKeyFn,
    columns,
    searchField: searchField ?? "name",
  });

  const {
    page,
    setPage,
    lastPage,
    pageNumbers,
    perPage,
    perPageOptions,
    handlePerPageChange,
  } = pagination;
  return (
    <div className="p-2 sm:p-6 max-w-4xl mx-auto w-full">
      <div className="mb-2 sm:mb-3 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold">{t(titleKey)}</h1>

        {headerActions}
      </div>

      {isError ? (
        <div className="rounded-md border p-8 text-center">
          <p className="text-muted-foreground mb-4">
            {t("errors.failed_to_load")}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            {t("errors.retry")}
          </Button>
        </div>
      ) : (
        <>
          <SearchFilter
            fieldName={searchField ?? "name"}
            placeholder={t(searchPlaceholder)}
            value={filters[searchField ?? "name"] ?? ""}
            onChange={setFilter}
          />
          <div className="rounded-md border overflow-hidden bg-card">
            <Table>
              <SortableTableHeader
                columns={columns}
                sort={sort}
                onToggleSort={toggleSort}
              />
              <TableBody>
                <TableContent
                  columns={columns}
                  items={items}
                  isOperationLoading={isOperationLoading}
                  perPage={pagination.perPage}
                  renderRowActions={renderRowActions}
                />
              </TableBody>
            </Table>
          </div>

          <TablePagination
            page={page}
            lastPage={lastPage}
            pageNumbers={pageNumbers}
            perPage={perPage}
            perPageOptions={perPageOptions}
            onPageChange={setPage}
            onPerPageChange={handlePerPageChange}
          />
        </>
      )}
    </div>
  );
};

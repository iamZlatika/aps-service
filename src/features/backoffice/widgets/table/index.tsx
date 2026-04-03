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
import { cn } from "@/shared/lib/utils.ts";

import { useSmartTable } from "./hooks/useSmartTable.ts";

type RowInteraction<T extends BaseItem> =
  | { onRowClick: (item: T) => void; renderRowActions?: never }
  | { renderRowActions: RenderRowActions<T>; onRowClick?: never }
  | { onRowClick?: never; renderRowActions?: never };

type SmartTableProps<T extends BaseItem = BaseItem> = {
  titleKey: string;
  api: SmartTableApi<T>;
  queryKeyFn: (
    page: number,
    perPage: number,
    sortColumn: string | null,
    sortType: SortType,
    filters: Record<string, string>,
  ) => readonly unknown[];
  columns: ColumnConfig<T>[];
  searchPlaceholder: string;
  searchField?: string;
  searchNumbersOnly?: boolean;
  headerActions?: ReactNode;
} & RowInteraction<T>;

export const SmartTable = <T extends BaseItem>({
  titleKey,
  api,
  queryKeyFn,
  searchPlaceholder,
  searchField,
  searchNumbersOnly,
  columns,
  renderRowActions,
  onRowClick,
  headerActions,
}: SmartTableProps<T>) => {
  const { t } = useTranslation();

  const {
    data: { items, isLoading, isRefetching, isError, refetch },
    pagination,
    sort: { sort, toggleSort },
    filters: { filters, setFilter },
  } = useSmartTable({
    api,
    queryKeyFn,
    columns,
    searchField: searchField ?? "name",
    tableKey: titleKey,
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

      <SearchFilter
        fieldName={searchField ?? "name"}
        placeholder={t(searchPlaceholder)}
        value={filters[searchField ?? "name"] ?? ""}
        onChange={setFilter}
        numbersOnly={searchNumbersOnly}
      />

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
          <div
            className={cn(
              "rounded-md border overflow-hidden bg-card",
              isRefetching && "opacity-60 pointer-events-none",
            )}
          >
            <Table>
              <SortableTableHeader
                columns={columns}
                sort={sort}
                onToggleSort={toggleSort}
                hasActions={!!renderRowActions}
              />
              <TableBody>
                <TableContent
                  columns={columns}
                  items={items}
                  isLoading={isLoading}
                  perPage={perPage}
                  renderRowActions={renderRowActions}
                  onRowClick={onRowClick}
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

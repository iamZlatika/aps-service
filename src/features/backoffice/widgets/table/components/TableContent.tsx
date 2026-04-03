import { useTranslation } from "react-i18next";

import { TableRow } from "@/features/backoffice/widgets/table/components/TableRow.tsx";
import TableSkeleton from "@/features/backoffice/widgets/table/components/TableSkeleton.tsx";
import type {
  BaseItem,
  ColumnConfig,
  RenderRowActions,
} from "@/features/backoffice/widgets/table/models/types.ts";
import {
  TableCell,
  TableRow as ShadCNTableRow,
} from "@/shared/components/ui/table.tsx";

interface TableContentProps<T extends BaseItem> {
  items: T[] | undefined;
  isLoading: boolean;
  perPage: number;
  columns: ColumnConfig<T>[];
  renderRowActions?: RenderRowActions<T>;
  onRowClick?: (item: T) => void;
}

export const TableContent = <T extends BaseItem>({
  items,
  isLoading,
  perPage,
  columns,
  renderRowActions,
  onRowClick,
}: TableContentProps<T>) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <TableSkeleton
        rowCount={perPage}
        colCount={columns.length}
        hasActions={!!renderRowActions}
      />
    );
  }

  if (!items || items.length === 0) {
    return (
      <ShadCNTableRow>
        <TableCell
          colSpan={columns.length + (renderRowActions ? 1 : 0)}
          className="h-24 text-center"
        >
          {t("table.no_results")}
        </TableCell>
      </ShadCNTableRow>
    );
  }

  return (
    <>
      {items.map((item) => (
        <TableRow
          key={item.id}
          item={item}
          columns={columns}
          renderActions={renderRowActions}
          onRowClick={onRowClick}
        />
      ))}
    </>
  );
};

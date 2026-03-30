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
  isOperationLoading: boolean;
  perPage: number;
  columns: ColumnConfig[];
  renderRowActions?: RenderRowActions<T>;
}

export const TableContent = <T extends BaseItem>({
  items,
  isOperationLoading,
  perPage,
  columns,
  renderRowActions,
}: TableContentProps<T>) => {
  const { t } = useTranslation();

  if (isOperationLoading) {
    return <TableSkeleton rowCount={perPage} colCount={columns.length + 1} />;
  }

  if (!items || items.length === 0) {
    return (
      <ShadCNTableRow>
        <TableCell colSpan={columns.length + 1} className="h-24 text-center">
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
        />
      ))}
    </>
  );
};

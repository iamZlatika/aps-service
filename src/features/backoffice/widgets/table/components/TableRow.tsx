import { resolveDisplayValue } from "@/features/backoffice/widgets/table/lib/resolveDisplayValue.ts";
import {
  TableCell,
  TableRow as ShadCNTableRow,
} from "@/shared/components/ui/table.tsx";

import type {
  BaseItem,
  ColumnConfig,
  RenderRowActions,
} from "../models/types.ts";

interface TableRowProps<T extends BaseItem> {
  item: T;
  columns: ColumnConfig<T>[];
  renderActions?: RenderRowActions<T>;
  onRowClick?: (item: T) => void;
}
export const TableRow = <T extends BaseItem>({
  item,
  columns,
  renderActions,
  onRowClick,
}: TableRowProps<T>) => {
  return (
    <ShadCNTableRow
      onClick={onRowClick ? () => onRowClick(item) : undefined}
      className={onRowClick ? "cursor-pointer" : undefined}
    >
      {columns.map((col) => (
        <TableCell key={col.key} className={col.className}>
          <span className="inline-block truncate max-w-[21ch] sm:max-w-none">
            {col.renderCell
              ? col.renderCell(item[col.key], item)
              : resolveDisplayValue(col, item[col.key])}
          </span>
        </TableCell>
      ))}
      {renderActions && (
        <TableCell className="inline-flex">
          <div className="flex justify-start gap-1">{renderActions(item)}</div>
        </TableCell>
      )}
    </ShadCNTableRow>
  );
};

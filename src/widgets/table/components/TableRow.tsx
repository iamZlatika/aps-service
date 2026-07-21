import {
  TableCell,
  TableRow as ShadCNTableRow,
} from "@/shared/components/ui/table.tsx";
import { cn } from "@/shared/lib/utils.ts";
import { resolveDisplayValue } from "@/widgets/table/lib/resolveDisplayValue.ts";

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
        <TableCell
          key={col.key}
          className={cn("first:pl-4 last:pr-4", col.className)}
        >
          <span className="inline-block truncate max-w-[21ch] sm:max-w-none">
            {col.renderCell
              ? col.renderCell(item[col.field], item)
              : resolveDisplayValue(col, item[col.field])}
          </span>
        </TableCell>
      ))}
      {renderActions && (
        <TableCell className="last:pr-4">
          <div className="inline-flex justify-start gap-1">
            {renderActions(item)}
          </div>
        </TableCell>
      )}
    </ShadCNTableRow>
  );
};

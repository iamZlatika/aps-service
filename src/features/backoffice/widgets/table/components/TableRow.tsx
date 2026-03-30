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
  columns: ColumnConfig[];
  renderActions?: RenderRowActions<T>;
}

export const TableRow = <T extends BaseItem>({
  item,
  columns,
  renderActions,
}: TableRowProps<T>) => {
  return (
    <ShadCNTableRow>
      {columns.map((col) => (
        <TableCell key={col.key} className={col.className}>
          <span className="block truncate max-w-[21ch] sm:max-w-none">
            {resolveDisplayValue(col, item[col.key])}
          </span>
        </TableCell>
      ))}
      {renderActions && (
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            {renderActions(item)} {/* ← вот тут item.id доступен! */}
          </div>
        </TableCell>
      )}
    </ShadCNTableRow>
  );
};

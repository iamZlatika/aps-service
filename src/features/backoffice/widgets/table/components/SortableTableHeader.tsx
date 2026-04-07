import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { SortType } from "@/features/backoffice/widgets/table/hooks/useSortParams.ts";
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table.tsx";
import { cn } from "@/shared/lib/utils.ts";

interface ColumnHeader {
  key: string;
  field: string;
  labelKey: string;
  sortable: boolean;
  className?: string;
}

interface SortableTableHeaderProps {
  columns: ColumnHeader[];
  sort: { column: string | null; type: SortType };
  onToggleSort: (key: string) => void;
  hasActions?: boolean;
}

export const SortableTableHeader = ({
  columns,
  sort,
  onToggleSort,
  hasActions,
}: SortableTableHeaderProps) => {
  const { t } = useTranslation();

  return (
    <TableHeader>
      <TableRow>
        {columns.map((col) => (
          <TableHead
            key={col.key}
            className={cn(
              col.sortable && "cursor-pointer select-none",
              col.className,
            )}
            onClick={col.sortable ? () => onToggleSort(col.field) : undefined}
          >
            <div className="flex items-center gap-1">
              {col.sortable &&
                (sort.column === col.field && sort.type === "asc" ? (
                  <ArrowUp className="h-4 w-4" />
                ) : sort.column === col.field && sort.type === "desc" ? (
                  <ArrowDown className="h-4 w-4" />
                ) : (
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                ))}
              {t(col.labelKey)}
            </div>
          </TableHead>
        ))}
        {hasActions && (
          <TableHead className="w-[80px] sm:w-[100px] text-right" />
        )}
      </TableRow>
    </TableHeader>
  );
};

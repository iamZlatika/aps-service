import { ArrowLeftToLine, ArrowRightFromLine, Trash2 } from "lucide-react";
import { type ReactNode, useState } from "react";

import { DeleteConfirmDialog } from "@/features/backoffice/modules/orders/components/info-table/DeleteConfirmDialog.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table.tsx";

export type InfoTableColumn<T> =
  | {
      key: keyof T & string;
      label: string;
      collapsible?: boolean;
      render?: (row: T) => ReactNode;
    }
  | {
      key: string;
      label: string;
      collapsible?: boolean;
      render: (row: T) => ReactNode;
    };

interface InfoTableProps<T extends { id: string | number }> {
  columns: InfoTableColumn<T>[];
  data: T[];
  onDelete?: (item: T) => void;
  isDeleting?: boolean;
  isUnchangeable?: (item: T) => boolean;
  onRowClick?: (item: T) => void;
  getRowKey?: (row: T) => string | number;
  deleteDialogTitle?: string;
  deleteDialogDescription?: string;
  children?: ReactNode;
  footer?: ReactNode;
}

export const InfoTable = <T extends { id: string | number }>({
  columns,
  data,
  onDelete,
  isDeleting,
  isUnchangeable,
  onRowClick,
  getRowKey,
  deleteDialogTitle,
  deleteDialogDescription,
  children,
  footer,
}: InfoTableProps<T>) => {
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const [collapsedKeys, setCollapsedKeys] = useState<Set<string>>(new Set());

  const collapse = (key: string) =>
    setCollapsedKeys((prev) => new Set([...prev, key]));

  const expand = (key: string) =>
    setCollapsedKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });

  const handleConfirmDelete = () => {
    if (pendingDelete && onDelete) {
      onDelete(pendingDelete);
      setPendingDelete(null);
    }
  };

  const expandKeyForColumn = (index: number): string | null => {
    const next = columns[index + 1];
    if (next?.collapsible && collapsedKeys.has(next.key)) return next.key;
    return null;
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table wrapperClassName="overflow-visible">
          <TableHeader>
            <TableRow>
              {columns.map((col, index) => {
                if (col.collapsible && collapsedKeys.has(col.key)) return null;

                const expandKey = expandKeyForColumn(index);

                return (
                  <TableHead key={col.key}>
                    <span className="flex items-center gap-1">
                      {col.collapsible && index > 0 && (
                        <button
                          onClick={() => collapse(col.key)}
                          className="text-muted-foreground hover:text-foreground shrink-0"
                        >
                          <ArrowLeftToLine size={14} />
                        </button>
                      )}
                      {col.label}
                      {expandKey && (
                        <button
                          onClick={() => expand(expandKey)}
                          className="text-muted-foreground hover:text-foreground shrink-0 ml-1"
                        >
                          <ArrowRightFromLine size={14} />
                        </button>
                      )}
                    </span>
                  </TableHead>
                );
              })}
              {onDelete !== undefined && <TableHead className="w-10" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={getRowKey ? getRowKey(row) : row.id}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? "cursor-pointer" : ""}
              >
                {columns.map((col) => {
                  if (col.collapsible && collapsedKeys.has(col.key))
                    return null;
                  return (
                    <TableCell key={col.key}>
                      {col.render
                        ? col.render(row)
                        : String(row[col.key as keyof T] ?? "")}
                    </TableCell>
                  );
                })}
                {onDelete !== undefined && (
                  <TableCell className="w-10 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      disabled={isDeleting || isUnchangeable?.(row)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPendingDelete(row);
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {(children || footer) && (
        <div className="flex items-center justify-between gap-2 border-t px-2 py-1.5">
          <div className="flex items-center gap-2">{children}</div>
          {footer && <div className="pr-2">{footer}</div>}
        </div>
      )}

      {onDelete !== undefined && (
        <DeleteConfirmDialog
          open={pendingDelete !== null}
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
          title={deleteDialogTitle}
          description={deleteDialogDescription}
        />
      )}
    </div>
  );
};

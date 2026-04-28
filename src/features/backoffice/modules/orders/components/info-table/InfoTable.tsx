import {
  ArrowLeftToLine,
  ArrowRightFromLine,
  Plus,
  Trash2,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table.tsx";

export type InfoTableColumn<T> = {
  key: string;
  label: string;
  collapsible?: boolean;
  render?: (row: T) => ReactNode;
};

interface InfoTableProps<T extends { id: string | number }> {
  columns: InfoTableColumn<T>[];
  data: T[];
  onDelete: (item: T) => void;
  onAddProduct?: () => void;
  onAddService?: () => void;
  deleteDialogTitle?: string;
  deleteDialogDescription?: string;
  children?: ReactNode;
}

export const InfoTable = <T extends { id: string | number }>({
  columns,
  data,
  onDelete,
  onAddProduct,
  onAddService,
  deleteDialogTitle,
  deleteDialogDescription,
  children,
}: InfoTableProps<T>) => {
  const { t } = useTranslation();
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
    if (pendingDelete) {
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
    <div className="rounded-md border">
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
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              {columns.map((col) => {
                if (col.collapsible && collapsedKeys.has(col.key)) return null;
                return (
                  <TableCell key={col.key}>
                    {col.render
                      ? col.render(row)
                      : String(row[col.key as keyof T] ?? "")}
                  </TableCell>
                );
              })}
              <TableCell className="w-10 text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => setPendingDelete(row)}
                >
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {(onAddProduct !== undefined || onAddService !== undefined) && (
        <div className="flex items-center gap-1 border-t px-2 py-1.5">
          {onAddProduct !== undefined && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={onAddProduct}
            >
              <Plus size={14} />
              {t("orders.orderTable.addProduct")}
            </Button>
          )}
          {onAddService !== undefined && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={onAddService}
            >
              <Plus size={14} />
              {t("orders.orderTable.addService")}
            </Button>
          )}
        </div>
      )}

      {children && (
        <div className="flex items-center gap-2 border-t px-2 py-1.5">
          {children}
        </div>
      )}

      <Dialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {deleteDialogTitle ?? t("common.deleteDialog.title")}
            </DialogTitle>
            <DialogDescription>
              {deleteDialogDescription ?? t("common.deleteDialog.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              {t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

import { memo } from "react";
import { useTranslation } from "react-i18next";

import { TableRow } from "@/shared/components/table/components/TableRow.tsx";
import TableSkeleton from "@/shared/components/table/components/TableSkeleton.tsx";
import type {
  BaseItem,
  ColumnConfig,
} from "@/shared/components/table/models/types.ts";
import {
  TableCell,
  TableRow as ShadCNTableRow,
} from "@/shared/components/ui/table.tsx";

interface TableContentProps {
  items: BaseItem[] | undefined;
  isOperationLoading: boolean;
  editingId: number | null;
  updatePending: boolean;
  perPage: number;
  columns: ColumnConfig[];
  onSave: (id: number, values: Partial<BaseItem>) => void;
  onCancel: () => void;
  onEdit: (item: BaseItem) => void;
  onDelete: (item: BaseItem) => void;
}

export const TableContent = memo(
  ({
    items,
    isOperationLoading,
    editingId,
    updatePending,
    perPage,
    columns,
    onSave,
    onCancel,
    onEdit,
    onDelete,
  }: TableContentProps) => {
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
            isEditing={editingId === item.id}
            updatePending={updatePending}
            onSave={onSave}
            onCancel={onCancel}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </>
    );
  },
);

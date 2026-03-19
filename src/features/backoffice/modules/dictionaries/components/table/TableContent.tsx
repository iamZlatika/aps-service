import { memo } from "react";
import { useTranslation } from "react-i18next";

import { DictionaryTableRow } from "@/features/backoffice/modules/dictionaries/components/table/TableRow.tsx";
import TableSkeleton from "@/features/backoffice/modules/dictionaries/components/table/TableSkeleton.tsx";
import { type DictionaryItem } from "@/features/backoffice/modules/dictionaries/types.ts";
import { TableCell, TableRow } from "@/shared/components/ui/table.tsx";

interface DictionaryTableContentProps {
  items: DictionaryItem[] | undefined;
  isOperationLoading: boolean;
  editingId: number | null;
  updatePending: boolean;
  onSave: (id: number, name: string) => void;
  onCancel: () => void;
  onEdit: (item: DictionaryItem) => void;
  onDelete: (item: DictionaryItem) => void;
}

export const TableContent = memo(
  ({
    items,
    isOperationLoading,
    editingId,
    updatePending,
    onSave,
    onCancel,
    onEdit,
    onDelete,
  }: DictionaryTableContentProps) => {
    const { t } = useTranslation();

    if (isOperationLoading) {
      return <TableSkeleton />;
    }

    if (!items || items.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={2} className="h-24 text-center">
            {t("sidebar.dictionaries_list.table.no_results")}
          </TableCell>
        </TableRow>
      );
    }

    return (
      <>
        {items.map((item) => (
          <DictionaryTableRow
            key={item.id}
            item={item}
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

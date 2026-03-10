import { useTranslation } from "react-i18next";

import { DictionaryTableRow } from "@/features/backoffice/modules/dictionaries/components/table/TableRow.tsx";
import TableSkeleton from "@/features/backoffice/modules/dictionaries/components/table/TableSkeleton.tsx";
import { type DictionaryItem } from "@/features/backoffice/modules/dictionaries/models/types.ts";
import { TableCell, TableRow } from "@/shared/components/ui/table.tsx";

interface DictionaryTableContentProps {
  items: DictionaryItem[] | undefined;
  isOperationLoading: boolean;
  editingId: number | null;
  editingName: string;
  setEditingName: (value: string) => void;
  updatePending: boolean;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEdit: (item: DictionaryItem) => void;
  onDelete: (item: DictionaryItem) => void;
}

export const TableContent = ({
  items,
  isOperationLoading,
  editingId,
  editingName,
  setEditingName,
  updatePending,
  onSaveEdit,
  onCancelEdit,
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
          editingId={editingId}
          editingName={editingName}
          setEditingName={setEditingName}
          updatePending={updatePending}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </>
  );
};

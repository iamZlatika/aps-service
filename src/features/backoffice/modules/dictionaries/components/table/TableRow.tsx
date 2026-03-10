import {
  AcceptButton,
  CancelButton,
  DeleteButton,
  EditButton,
} from "@/features/backoffice/modules/dictionaries/components/table/buttons";
import EditInputCell from "@/features/backoffice/modules/dictionaries/components/table/EditInputCell.tsx";
import { type DictionaryItem } from "@/features/backoffice/modules/dictionaries/models/types.ts";
import { TableCell, TableRow } from "@/shared/components/ui/table.tsx";

interface DictionaryTableRowProps {
  item: DictionaryItem;
  editingId: number | null;
  editingName: string;
  setEditingName: (value: string) => void;
  updatePending: boolean;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEdit: (item: DictionaryItem) => void;
  onDelete: (item: DictionaryItem) => void;
}
export const DictionaryTableRow = ({
  item,
  editingId,
  editingName,
  setEditingName,
  updatePending,
  onSaveEdit,
  onCancelEdit,
  onEdit,
  onDelete,
}: DictionaryTableRowProps) => {
  const isEditing = editingId === item.id;

  return (
    <TableRow>
      <TableCell className="font-medium">
        <EditInputCell
          value={editingName}
          onChange={setEditingName}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
          isEditing={isEditing}
          name={item.name}
        />
      </TableCell>

      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {isEditing ? (
            <>
              <AcceptButton onClick={onSaveEdit} disabled={updatePending} />
              <CancelButton onClick={onCancelEdit} disabled={updatePending} />
            </>
          ) : (
            <>
              <EditButton onClick={() => onEdit(item)} />
              <DeleteButton onClick={() => onDelete(item)} />
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

import {
  DeleteButton,
  EditButton,
} from "@/features/backoffice/widgets/table/components/buttons";
import type { BaseItem } from "@/features/backoffice/widgets/table/models/types.ts";

interface RowActionsProps {
  item: BaseItem;
  onEdit: (item: BaseItem) => void;
  onDelete: (item: BaseItem) => void;
}

export const RowActions = ({ item, onEdit, onDelete }: RowActionsProps) => (
  <>
    <EditButton onClick={() => onEdit(item)} />
    <DeleteButton onClick={() => onDelete(item)} />
  </>
);

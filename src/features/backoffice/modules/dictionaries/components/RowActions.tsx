import type { BaseItem } from "@/features/backoffice/widgets/table/models/types.ts";
import { DeleteButton, EditButton } from "@/shared/components/common/buttons";

interface RowActionsProps<T extends BaseItem> {
  item: T;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  deleteDisabled?: boolean;
}

export const RowActions = <T extends BaseItem>({
  item,
  onEdit,
  onDelete,
  deleteDisabled,
}: RowActionsProps<T>) => (
  <>
    <EditButton onClick={() => onEdit(item)} />
    <DeleteButton onClick={() => onDelete(item)} disabled={deleteDisabled} />
  </>
);

import { zodResolver } from "@hookform/resolvers/zod";
import type { KeyboardEvent } from "react";
import { memo } from "react";
import { useForm } from "react-hook-form";

import {
  AcceptButton,
  CancelButton,
  DeleteButton,
  EditButton,
} from "@/features/backoffice/modules/dictionaries/components/table/buttons";
import {
  type EditItemFormValues,
  editItemSchema,
} from "@/features/backoffice/modules/dictionaries/components/table/editItem.schema.ts";
import { type DictionaryItem } from "@/features/backoffice/modules/dictionaries/types.ts";
import { Input } from "@/shared/components/ui/input.tsx";
import { TableCell, TableRow } from "@/shared/components/ui/table.tsx";

interface DictionaryTableRowProps {
  item: DictionaryItem;
  isEditing: boolean;
  updatePending: boolean;
  onSave: (id: number, name: string) => void;
  onCancel: () => void;
  onEdit: (item: DictionaryItem) => void;
  onDelete: (item: DictionaryItem) => void;
}

export const DictionaryTableRow = memo(
  ({
    item,
    isEditing,
    updatePending,
    onSave,
    onCancel,
    onEdit,
    onDelete,
  }: DictionaryTableRowProps) => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<EditItemFormValues>({
      resolver: zodResolver(editItemSchema),
      defaultValues: { name: item.name },
    });

    const onSubmit = (data: EditItemFormValues) => {
      onSave(item.id, data.name);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    return (
      <TableRow>
        <TableCell className="font-medium">
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} id={`edit-${item.id}`}>
              <Input
                {...register("name")}
                onKeyDown={handleKeyDown}
                autoFocus
                className={`h-8 ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && (
                <span className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </span>
              )}
            </form>
          ) : (
            <span className="block truncate max-w-[21ch] sm:max-w-none">
              {item.name}
            </span>
          )}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <AcceptButton
                  onClick={handleSubmit(onSubmit)}
                  disabled={updatePending}
                />
                <CancelButton onClick={onCancel} disabled={updatePending} />
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
  },
);

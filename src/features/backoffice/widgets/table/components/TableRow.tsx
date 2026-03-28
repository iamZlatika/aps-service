import { zodResolver } from "@hookform/resolvers/zod";
import type { KeyboardEvent } from "react";
import { memo } from "react";
import { useForm } from "react-hook-form";

import { resolveDisplayValue } from "@/features/backoffice/widgets/table/lib/resolveDisplayValue.ts";
import { Input } from "@/shared/components/ui/input.tsx";
import {
  TableCell,
  TableRow as ShadCNTableRow,
} from "@/shared/components/ui/table.tsx";

import {
  type EditItemFormValues,
  editItemSchema,
} from "../models/editItem.schema.ts";
import type { BaseItem, ColumnConfig } from "../models/types.ts";
import {
  AcceptButton,
  CancelButton,
  DeleteButton,
  EditButton,
} from "./buttons";

interface TableRowProps {
  item: BaseItem;
  columns: ColumnConfig[];
  isEditing: boolean;
  updatePending: boolean;
  onSave: (id: number, values: Partial<BaseItem>) => void;
  onCancel: () => void;
  onEdit: (item: BaseItem) => void;
  onDelete: (item: BaseItem) => void;
}

export const TableRow = memo(
  ({
    item,
    columns,
    isEditing,
    updatePending,
    onSave,
    onCancel,
    onEdit,
    onDelete,
  }: TableRowProps) => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<EditItemFormValues>({
      resolver: zodResolver(editItemSchema),
      defaultValues: { name: String(item.name ?? "") },
    });

    const onSubmit = (data: EditItemFormValues) => {
      onSave(item.id, { name: data.name });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") onCancel();
    };

    return (
      <ShadCNTableRow>
        {columns.map((col) => (
          <TableCell key={col.key} className={col.className}>
            {isEditing && col.key === "name" ? (
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
                {resolveDisplayValue(col, item[col.key])}
              </span>
            )}
          </TableCell>
        ))}
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
      </ShadCNTableRow>
    );
  },
);

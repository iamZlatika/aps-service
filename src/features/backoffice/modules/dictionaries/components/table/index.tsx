import { Plus } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { TableContent } from "@/features/backoffice/modules/dictionaries/components/table/TableContent.tsx";
import { type DictionaryItem } from "@/features/backoffice/modules/dictionaries/types.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table.tsx";

import { AddItemDialog, DeleteConfirmDialog } from "./dialogs";
import { useDictionaryActions } from "./hooks/useDictionaryActions";

interface DictionaryTableProps {
  title: string;
  addButtonLabel: string;
  items: DictionaryItem[] | undefined;
  isLoading: boolean;
  isFetching: boolean;
  queryKey: readonly string[];
  onAdd: (name: string) => Promise<DictionaryItem>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, name: string) => Promise<DictionaryItem>;
}

export const DictionaryTable = memo(
  ({
    title,
    addButtonLabel,
    items,
    isLoading,
    isFetching,
    queryKey,
    onAdd,
    onDelete,
    onUpdate,
  }: DictionaryTableProps) => {
    const { t } = useTranslation();

    const { addModal, deleteModal, editing } = useDictionaryActions(
      queryKey,
      onAdd,
      onDelete,
      onUpdate,
    );

    const isOperationLoading =
      isLoading ||
      isFetching ||
      addModal.isPending ||
      deleteModal.isPending ||
      editing.isPending;

    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{title}</h1>

          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => addModal.setOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            {addButtonLabel}
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {t("sidebar.dictionaries_list.table.name")}
                </TableHead>
                <TableHead className="w-[100px] text-right"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableContent
                items={items}
                isOperationLoading={isOperationLoading}
                editingId={editing.id}
                updatePending={editing.isPending}
                onSave={editing.save}
                onCancel={editing.cancel}
                onEdit={editing.start}
                onDelete={deleteModal.requestDelete}
              />
            </TableBody>
          </Table>
        </div>

        <AddItemDialog
          isOpen={addModal.isOpen}
          onOpenChange={addModal.setOpen}
          title={t("sidebar.dictionaries_list.table.add_modal.title")}
          placeholder={t(
            "sidebar.dictionaries_list.table.add_modal.input_placeholder",
          )}
          cancelLabel={t("sidebar.dictionaries_list.table.add_modal.cancel")}
          confirmLabel={t("sidebar.dictionaries_list.table.add_modal.add")}
          onConfirm={addModal.submit}
          isPending={addModal.isPending}
          value={addModal.value}
          onValueChange={addModal.setValue}
        />

        <DeleteConfirmDialog
          isOpen={deleteModal.isOpen}
          onOpenChange={deleteModal.setOpen}
          title={t("sidebar.dictionaries_list.table.delete_modal.title")}
          description={t(
            "sidebar.dictionaries_list.table.delete_modal.description",
            {
              name: deleteModal.item?.name,
            },
          )}
          cancelLabel={t("sidebar.dictionaries_list.table.delete_modal.cancel")}
          confirmLabel={t(
            "sidebar.dictionaries_list.table.delete_modal.confirm",
          )}
          onConfirm={deleteModal.confirm}
          isPending={deleteModal.isPending}
        />
      </div>
    );
  },
);

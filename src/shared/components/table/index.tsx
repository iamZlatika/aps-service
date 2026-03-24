import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { SortType } from "@/shared/components/table/hooks/useSortParams.ts";
import type {
  ColumnConfig,
  SmartTableApi,
} from "@/shared/components/table/types.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { Table, TableBody } from "@/shared/components/ui/table.tsx";

import { AddItemDialog, DeleteConfirmDialog, EditItemDialog } from "./dialogs";
import { useSmartTable } from "./hooks/useSmartTable.ts";
import { toFieldConfigs } from "./lib/toFieldConfigs.ts";
import { SortableTableHeader } from "./SortableTableHeader.tsx";
import { TableContent } from "./TableContent.tsx";
import { TablePagination } from "./TablePagination.tsx";

interface SmartTableProps {
  titleKey: string;
  api: SmartTableApi;
  queryKeyFn: (
    page: number,
    perPage: number,
    sortColumn: string | null,
    sortType: SortType,
  ) => readonly (string | number | null)[];
  columns: ColumnConfig[];
}

export const SmartTable = ({
  titleKey,
  api,
  queryKeyFn,
  columns,
}: SmartTableProps) => {
  const { t } = useTranslation();

  const {
    items,
    editableFields,
    hasExtraFields,
    isOperationLoading,
    isError,
    refetch,
    page,
    setPage,
    lastPage,
    pageNumbers,
    perPage,
    perPageOptions,
    handlePerPageChange,
    sort,
    toggleSort,
    addModal,
    deleteModal,
    editing,
    handleEditStart,
    editDialogItem,
    setEditDialogItem,
    handleEditDialogConfirm,
  } = useSmartTable({ api, queryKeyFn, columns });

  const fieldConfigs = toFieldConfigs(editableFields, t);

  return (
    <div className="p-2 sm:p-6 max-w-4xl mx-auto w-full">
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold">{t(titleKey)}</h1>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => addModal.setOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("table.add_button")}
        </Button>
      </div>

      {isError ? (
        <div className="rounded-md border p-8 text-center">
          <p className="text-muted-foreground mb-4">
            {t("errors.failed_to_load")}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            {t("errors.retry")}
          </Button>
        </div>
      ) : (
        <>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <SortableTableHeader
                columns={columns}
                sort={sort}
                onToggleSort={toggleSort}
              />
              <TableBody>
                <TableContent
                  columns={columns}
                  items={items}
                  isOperationLoading={isOperationLoading}
                  editingId={editing.id}
                  updatePending={editing.isPending}
                  perPage={perPage}
                  onSave={editing.save}
                  onCancel={editing.cancel}
                  onEdit={handleEditStart}
                  onDelete={deleteModal.requestDelete}
                />
              </TableBody>
            </Table>
          </div>

          <TablePagination
            page={page}
            lastPage={lastPage}
            pageNumbers={pageNumbers}
            perPage={perPage}
            perPageOptions={perPageOptions}
            onPageChange={setPage}
            onPerPageChange={handlePerPageChange}
          />
        </>
      )}

      <AddItemDialog
        isOpen={addModal.isOpen}
        onOpenChange={addModal.setOpen}
        title={t("table.add_modal.title")}
        fields={toFieldConfigs(editableFields, t)}
        cancelLabel={t("table.add_modal.cancel")}
        confirmLabel={t("table.add_modal.add")}
        onConfirm={addModal.submit}
        isPending={addModal.isPending}
      />

      <DeleteConfirmDialog
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.setOpen}
        title={t("table.delete_modal.title")}
        description={t("table.delete_modal.description", {
          name: deleteModal.item?.name,
        })}
        cancelLabel={t("table.delete_modal.cancel")}
        confirmLabel={t("table.delete_modal.confirm")}
        onConfirm={deleteModal.confirm}
        isPending={deleteModal.isPending}
      />

      {hasExtraFields && (
        <EditItemDialog
          isOpen={editDialogItem !== null}
          onOpenChange={(open) => {
            if (!open) setEditDialogItem(null);
          }}
          title={t("table.edit_modal.title")}
          fields={fieldConfigs}
          values={editDialogItem ?? {}}
          onConfirm={handleEditDialogConfirm}
          isPending={editing.isPending}
          cancelLabel={t("table.edit_modal.cancel")}
          confirmLabel={t("table.edit_modal.confirm")}
        />
      )}
    </div>
  );
};

import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  SortableTableHeader,
  TableContent,
  TablePagination,
} from "@/features/backoffice/widgets/table/components";
import SearchFilter from "@/features/backoffice/widgets/table/components/filters/FilterInput.tsx";
import type { SortType } from "@/features/backoffice/widgets/table/hooks/useSortParams.ts";
import type {
  ColumnConfig,
  SmartTableApi,
} from "@/features/backoffice/widgets/table/models/types.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { Table, TableBody } from "@/shared/components/ui/table.tsx";

import { DeleteConfirmDialog, ItemFormDialog } from "./components/dialogs";
import { useSmartTable } from "./hooks/useSmartTable.ts";
import { toFieldConfigs } from "./lib/toFieldConfigs.ts";

interface SmartTableProps {
  titleKey: string;
  api: SmartTableApi;
  searchPlaceholder: string;
  searchField?: string;
  queryKeyFn: (
    page: number,
    perPage: number,
    sortColumn: string | null,
    sortType: SortType,
    filters: Record<string, string>,
  ) => readonly unknown[];
  columns: ColumnConfig[];
}

export const SmartTable = ({
  titleKey,
  api,
  queryKeyFn,
  searchPlaceholder,
  searchField,
  columns,
}: SmartTableProps) => {
  const { t } = useTranslation();

  const {
    data: {
      items,
      editableFields,
      hasExtraFields,
      isOperationLoading,
      isError,
      refetch,
    },
    pagination: {
      page,
      setPage,
      lastPage,
      pageNumbers,
      perPage,
      perPageOptions,
      handlePerPageChange,
    },
    sort: { sort, toggleSort },
    filters: { filters, setFilter },
    actions: {
      addModal,
      deleteModal,
      editing,
      handleEditStart,
      editDialogItem,
      setEditDialogItem,
      handleEditDialogConfirm,
    },
  } = useSmartTable({
    api,
    queryKeyFn,
    columns,
    searchField: searchField ?? "name",
  });

  const fieldConfigs = toFieldConfigs(editableFields, t);

  return (
    <div className="p-2 sm:p-6 max-w-4xl mx-auto w-full">
      <div className="mb-2 sm:mb-3 flex items-center justify-between">
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
          <SearchFilter
            fieldName={searchField ?? "name"}
            placeholder={t(searchPlaceholder)}
            value={filters[searchField ?? "name"] ?? ""}
            onChange={setFilter}
          />
          <div className="rounded-md border overflow-hidden bg-card">
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

      <ItemFormDialog
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
        <ItemFormDialog
          isOpen={editDialogItem !== null}
          onOpenChange={(open) => {
            if (!open) setEditDialogItem(null);
          }}
          title={t("table.edit_modal.title")}
          fields={fieldConfigs}
          values={editDialogItem ?? undefined}
          cancelLabel={t("table.edit_modal.cancel")}
          confirmLabel={t("table.edit_modal.confirm")}
          onConfirm={handleEditDialogConfirm}
          isPending={editing.isPending}
        />
      )}
    </div>
  );
};

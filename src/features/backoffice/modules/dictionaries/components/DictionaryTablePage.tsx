import { useTranslation } from "react-i18next";

import { AddButton } from "@/features/backoffice/modules/dictionaries/components/AddButton.tsx";
import { RowActions } from "@/features/backoffice/modules/dictionaries/components/RowActions.tsx";
import type { DictionaryItem } from "@/features/backoffice/modules/dictionaries/types.ts";
import { SmartTable } from "@/features/backoffice/widgets/table";
import {
  DeleteConfirmDialog,
  ItemFormDialog,
} from "@/features/backoffice/widgets/table/components/dialogs";
import type { SortType } from "@/features/backoffice/widgets/table/hooks/useSortParams.ts";
import { useTableActions } from "@/features/backoffice/widgets/table/hooks/useTableActions.ts";
import { toFieldConfigs } from "@/features/backoffice/widgets/table/lib/toFieldConfigs.ts";
import type {
  ColumnConfig,
  SmartTableApi,
} from "@/features/backoffice/widgets/table/models/types.ts";

interface DictionaryApi<T extends DictionaryItem> extends SmartTableApi<T> {
  create: (values: Partial<T>) => Promise<T>;
  update: (id: number, values: Partial<T>) => Promise<T>;
  remove: (id: number) => Promise<void>;
}

interface DictionaryTablePageProps<T extends DictionaryItem> {
  titleKey: string;
  api: DictionaryApi<T>;
  queryKeyFn: (
    page?: number,
    perPage?: number,
    sortColumn?: string | null,
    sortType?: SortType,
    filters?: Record<string, string>,
  ) => readonly unknown[];
  columns: ColumnConfig<T>[];
  searchPlaceholder?: string;
}

export const DictionaryTablePage = <T extends DictionaryItem>({
  titleKey,
  api,
  queryKeyFn,
  columns,
  searchPlaceholder = "search_placeholders.dictionaries_name",
}: DictionaryTablePageProps<T>) => {
  const { t } = useTranslation();

  const { addModal, deleteModal, editModal } = useTableActions<T>(
    queryKeyFn,
    api.create,
    api.remove,
    api.update,
  );

  const fieldConfigs = toFieldConfigs(columns, t);

  return (
    <>
      <SmartTable
        titleKey={titleKey}
        api={api}
        queryKeyFn={queryKeyFn}
        searchPlaceholder={searchPlaceholder}
        columns={columns}
        searchField="name"
        headerActions={<AddButton onClick={() => addModal.setOpen(true)} />}
        renderRowActions={(item) => (
          <RowActions
            item={item}
            onEdit={editModal.start}
            onDelete={deleteModal.requestDelete}
          />
        )}
      />

      <ItemFormDialog
        isOpen={addModal.isOpen}
        onOpenChange={addModal.setOpen}
        title={t("table.add_modal.title")}
        fields={fieldConfigs}
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

      <ItemFormDialog
        isOpen={editModal.isOpen}
        onOpenChange={(open) => {
          if (!open) editModal.close();
        }}
        title={t("table.edit_modal.title")}
        fields={fieldConfigs}
        values={editModal.item ?? undefined}
        cancelLabel={t("table.edit_modal.cancel")}
        confirmLabel={t("table.edit_modal.confirm")}
        onConfirm={editModal.confirm}
        isPending={editModal.isPending}
      />
    </>
  );
};

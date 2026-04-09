import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { orderStatusesApi } from "@/features/backoffice/modules/dictionaries/api";
import type { OrderStatusDto } from "@/features/backoffice/modules/dictionaries/api/dto.ts";
import { AddButton } from "@/features/backoffice/modules/dictionaries/components/AddButton.tsx";
import { RowActions } from "@/features/backoffice/modules/dictionaries/components/RowActions.tsx";
import {
  EditOrderStatusSchema,
  NewOrderStatusSchema,
} from "@/features/backoffice/modules/dictionaries/lib/schema.ts";
import { type StatusColor } from "@/features/backoffice/modules/dictionaries/types.ts";
import { SmartTable } from "@/features/backoffice/widgets/table";
import {
  DeleteConfirmDialog,
  ItemFormDialog,
} from "@/features/backoffice/widgets/table/components/dialogs";
import { useTableActions } from "@/features/backoffice/widgets/table/hooks/useTableActions.ts";
import type {
  ColumnConfig,
  FieldConfig,
} from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { statusColorMap, statusTextColorMap } from "@/shared/lib/constants.ts";
import { cn } from "@/shared/lib/utils.ts";
import { STATUS_COLORS } from "@/shared/types.ts";

const colorOptions = Object.values(STATUS_COLORS).map((color) => ({
  value: color,
  label: color,
  colorDot: statusColorMap[color as StatusColor],
}));
const renderStatusBadge = (
  value: string | number | boolean,
  item: OrderStatusDto,
) => (
  <span
    className={cn(
      "inline-block rounded px-2 py-0.5 text-sm font-medium",
      statusColorMap[item.color],
      statusTextColorMap[item.color],
    )}
  >
    {value}
  </span>
);

const columns: ColumnConfig<OrderStatusDto>[] = [
  {
    key: "key",
    field: "key",
    labelKey: "dictionaries.table_fields.key",
    sortable: true,
  },
  {
    key: "name_ua",
    field: "name_ua",
    labelKey: "dictionaries.table_fields.name_ua",
    sortable: false,
    renderCell: (value, item) => renderStatusBadge(value, item),
  },
  {
    key: "name_ru",
    field: "name_ru",
    labelKey: "dictionaries.table_fields.name_ru",
    sortable: false,
    renderCell: (value, item) => renderStatusBadge(value, item),
  },
];

const OrderStatusesPage = () => {
  const { t } = useTranslation();

  const { addModal, deleteModal, editModal } = useTableActions<OrderStatusDto>(
    queryKeys.dictionaries.orderStatuses,
    orderStatusesApi.create,
    orderStatusesApi.remove,
    orderStatusesApi.update,
  );

  const addFieldConfigs: FieldConfig[] = useMemo(
    () => [
      {
        key: "key",
        label: t("dictionaries.table_fields.key"),
        placeholder: t("dictionaries.placeholders.key"),
        required: true,
      },
      {
        key: "name_ua",
        label: t("dictionaries.table_fields.name_ua"),
        placeholder: t("dictionaries.placeholders.name"),
        required: true,
      },
      {
        key: "name_ru",
        label: t("dictionaries.table_fields.name_ru"),
        placeholder: t("dictionaries.placeholders.name"),
        required: true,
      },
      {
        key: "color",
        label: t("dictionaries.table_fields.color"),
        placeholder: t("dictionaries.placeholders.color"),
        type: "select",
        options: colorOptions,
        required: true,
      },
    ],
    [t],
  );

  const editFieldConfigs: FieldConfig[] = useMemo(
    () => [
      {
        key: "name_ua",
        label: t("dictionaries.table_fields.name_ua"),
        placeholder: t("dictionaries.placeholders.name"),
        required: true,
      },
      {
        key: "name_ru",
        label: t("dictionaries.table_fields.name_ru"),
        placeholder: t("dictionaries.placeholders.name"),
        required: true,
      },
      {
        key: "color",
        label: t("dictionaries.table_fields.color"),
        placeholder: t("dictionaries.placeholders.color"),
        type: "select",
        options: colorOptions,
        required: true,
      },
    ],
    [t],
  );

  return (
    <>
      <SmartTable
        titleKey="breadcrumbs.orderStatuses"
        api={orderStatusesApi}
        queryKeyFn={queryKeys.dictionaries.orderStatuses}
        searchPlaceholder="search_placeholders.dictionaries_name"
        columns={columns}
        headerActions={<AddButton onClick={() => addModal.setOpen(true)} />}
        renderRowActions={(item) => (
          <RowActions
            item={item}
            onEdit={editModal.start}
            onDelete={deleteModal.requestDelete}
            deleteDisabled={item.is_system}
          />
        )}
      />

      <ItemFormDialog
        isOpen={addModal.isOpen}
        onOpenChange={addModal.setOpen}
        title={t("table.add_modal.title")}
        fields={addFieldConfigs}
        schema={NewOrderStatusSchema}
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
          name: deleteModal.item?.name_ru ?? deleteModal.item?.key,
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
        fields={editFieldConfigs}
        schema={EditOrderStatusSchema}
        values={editModal.item ?? undefined}
        cancelLabel={t("table.edit_modal.cancel")}
        confirmLabel={t("table.edit_modal.confirm")}
        onConfirm={editModal.confirm}
        isPending={editModal.isPending}
      />
    </>
  );
};

export default OrderStatusesPage;

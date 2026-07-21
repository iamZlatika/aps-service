import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { type OrderStatus } from "@/entities/order-status/types";
import { ABILITIES } from "@/features/auth/abilities.ts";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { orderStatusesApi } from "@/features/dictionaries/api";
import { RowActions } from "@/features/dictionaries/components/RowActions.tsx";
import {
  EditOrderStatusSchema,
  NewOrderStatusSchema,
} from "@/features/dictionaries/lib/schema.ts";
import { type StatusColor } from "@/features/dictionaries/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { AddButton } from "@/shared/components/AddButton";
import { StatusBadge } from "@/shared/components/common/StatusBadge.tsx";
import { statusColorMap } from "@/shared/lib/constants.ts";
import { STATUS_COLORS } from "@/shared/types.ts";
import { SmartTable } from "@/widgets/table";
import {
  DeleteConfirmDialog,
  ItemFormDialog,
} from "@/widgets/table/components/dialogs";
import { useTableActions } from "@/widgets/table/hooks/useTableActions.ts";
import type {
  ColumnConfig,
  FieldConfig,
} from "@/widgets/table/models/types.ts";

const colorOptions = Object.values(STATUS_COLORS).map((color) => ({
  value: color,
  label: color,
  colorDot: statusColorMap[color as StatusColor],
}));

const columns: ColumnConfig<OrderStatus>[] = [
  {
    key: "key",
    field: "key",
    labelKey: "dictionaries.table_fields.key",
    sortable: true,
  },
  {
    key: "nameUa",
    field: "nameUa",
    labelKey: "dictionaries.table_fields.name_ua",
    sortable: false,
    renderCell: (value, item) => (
      <StatusBadge name={String(value)} color={item.color} />
    ),
  },
  {
    key: "nameRu",
    field: "nameRu",
    labelKey: "dictionaries.table_fields.name_ru",
    sortable: false,
    renderCell: (value, item) => (
      <StatusBadge name={String(value)} color={item.color} />
    ),
  },
];

const OrderStatusesPage = () => {
  const { t } = useTranslation();
  const { can } = useAuth();
  const canManage = can(ABILITIES.DICTIONARIES_MANAGE);

  const { addModal, deleteModal, editModal } = useTableActions<OrderStatus>(
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
        headerActions={
          canManage ? (
            <AddButton onClick={() => addModal.setOpen(true)} />
          ) : undefined
        }
        renderRowActions={
          canManage
            ? (item) => (
                <RowActions
                  item={item}
                  onEdit={editModal.start}
                  onDelete={deleteModal.requestDelete}
                  deleteDisabled={item.isSystem}
                />
              )
            : undefined
        }
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
          name: deleteModal.item?.nameRu ?? deleteModal.item?.key,
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

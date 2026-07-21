import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { type Location } from "@/entities/location/types";
import { ABILITIES } from "@/features/auth/abilities.ts";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { locationApi } from "@/features/dictionaries/api";
import { LocationFormDialog } from "@/features/dictionaries/components/LocationFormDialog.tsx";
import { RowActions } from "@/features/dictionaries/components/RowActions.tsx";
import { useDeleteLocation } from "@/features/dictionaries/hooks/useDeleteLocation.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { AddButton } from "@/shared/components/AddButton";
import { PhoneDropdown } from "@/shared/components/PhoneDropdown";
import { SmartTable } from "@/widgets/table";
import { DeleteConfirmDialog } from "@/widgets/table/components/dialogs";
import type { ColumnConfig } from "@/widgets/table/models/types.ts";

const LocationsPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { can } = useAuth();
  const canManage = can(ABILITIES.DICTIONARIES_LOCATIONS_MANAGE);

  const [formState, setFormState] = useState<{
    isOpen: boolean;
    item: Location | null;
  }>({ isOpen: false, item: null });

  const [deleteItem, setDeleteItem] = useState<Location | null>(null);

  const { deleteLocation, isPending: isDeletePending } = useDeleteLocation(() =>
    setDeleteItem(null),
  );

  const columns: ColumnConfig<Location>[] = [
    {
      key: "name",
      field: "name",
      labelKey: "dictionaries.table_fields.name",
      sortable: true,
    },
    {
      key: "address",
      field: "addressRu",
      labelKey: "dictionaries.table_fields.address",
      sortable: true,
    },
    {
      key: "phone",
      field: "phone",
      labelKey: "dictionaries.table_fields.phone",
      sortable: false,
      type: "phone",
      renderCell: (value) => {
        if (typeof value !== "string") return null;
        return (
          <div className="flex flex-col">
            <PhoneDropdown phoneNumber={value} />
          </div>
        );
      },
    },
    {
      key: "scheduleDisplay",
      field: "scheduleDisplay",
      labelKey: "dictionaries.table_fields.schedule",
      sortable: false,
      required: false,
    },
  ];

  return (
    <>
      <SmartTable
        titleKey="sidebar.dictionaries_list.locations"
        api={locationApi}
        queryKeyFn={queryKeys.dictionaries.locations}
        columns={columns}
        searchPlaceholder="search_placeholders.dictionaries_name"
        headerActions={
          canManage ? (
            <AddButton
              onClick={() => setFormState({ isOpen: true, item: null })}
            />
          ) : undefined
        }
        renderRowActions={
          canManage
            ? (item) => (
                <RowActions
                  item={item}
                  onEdit={(loc) => setFormState({ isOpen: true, item: loc })}
                  onDelete={(loc) => setDeleteItem(loc)}
                />
              )
            : undefined
        }
      />

      <LocationFormDialog
        isOpen={formState.isOpen}
        location={formState.item}
        onOpenChange={(open) => {
          if (!open) setFormState({ isOpen: false, item: null });
        }}
        onSuccess={() => {
          setFormState({ isOpen: false, item: null });
          void queryClient.invalidateQueries({
            queryKey: queryKeys.dictionaries.locations(),
          });
        }}
      />

      <DeleteConfirmDialog
        isOpen={deleteItem !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteItem(null);
        }}
        title={t("table.delete_modal.title")}
        description={t("table.delete_modal.description", {
          name: deleteItem?.name ?? "",
        })}
        cancelLabel={t("table.delete_modal.cancel")}
        confirmLabel={t("table.delete_modal.confirm")}
        onConfirm={() => {
          if (deleteItem) deleteLocation(deleteItem.id);
        }}
        isPending={isDeletePending}
      />
    </>
  );
};

export default LocationsPage;

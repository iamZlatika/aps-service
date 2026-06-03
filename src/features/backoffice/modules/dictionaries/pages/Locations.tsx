import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { type Location } from "@/entities/location/types";
import { PhoneDropdown } from "@/features/backoffice/components/PhoneDropdown";
import { locationApi } from "@/features/backoffice/modules/dictionaries/api";
import { AddButton } from "@/features/backoffice/modules/dictionaries/components/AddButton.tsx";
import { LocationFormDialog } from "@/features/backoffice/modules/dictionaries/components/LocationFormDialog.tsx";
import { RowActions } from "@/features/backoffice/modules/dictionaries/components/RowActions.tsx";
import { SmartTable } from "@/features/backoffice/widgets/table";
import { DeleteConfirmDialog } from "@/features/backoffice/widgets/table/components/dialogs";
import type { ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { notifyError } from "@/shared/lib/errors/services.ts";

const LocationsPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState<{
    isOpen: boolean;
    item: Location | null;
  }>({ isOpen: false, item: null });

  const [deleteItem, setDeleteItem] = useState<Location | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => locationApi.remove(id),
    onSuccess: () => {
      setDeleteItem(null);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.dictionaries.locations(),
      });
    },
    onError: (error) => notifyError(error),
  });

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
          <AddButton
            onClick={() => setFormState({ isOpen: true, item: null })}
          />
        }
        renderRowActions={(item) => (
          <RowActions
            item={item}
            onEdit={(loc) => setFormState({ isOpen: true, item: loc })}
            onDelete={(loc) => setDeleteItem(loc)}
          />
        )}
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
          if (deleteItem) deleteMutation.mutate(deleteItem.id);
        }}
        isPending={deleteMutation.isPending}
      />
    </>
  );
};

export default LocationsPage;

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { type WorkTypeInfo } from "@/entities/work/types";
import { AddButton } from "@/features/backoffice/components/AddButton";
import { worksApi } from "@/features/backoffice/modules/works/api";
import { WORKS_LINKS } from "@/features/backoffice/modules/works/navigation";
import { type BackofficeWork } from "@/features/backoffice/modules/works/types";
import { SmartTable } from "@/features/backoffice/widgets/table";
import { DeleteConfirmDialog } from "@/features/backoffice/widgets/table/components/dialogs";
import { type ColumnConfig } from "@/features/backoffice/widgets/table/models/types";
import { queryKeys } from "@/shared/api/queryKeys";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { useLocalize } from "@/shared/hooks/useLocalize";
import { formatDate } from "@/shared/lib/utils";

const WorksPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const localize = useLocalize();

  const columns: ColumnConfig<BackofficeWork>[] = useMemo(
    () => [
      {
        key: "deviceType",
        field: "deviceType",
        labelKey: "works.table_fields.device_type",
        sortable: true,
      },
      {
        key: "manufacturer",
        field: "manufacturer",
        labelKey: "works.table_fields.manufacturer",
        sortable: true,
      },
      {
        key: "deviceModel",
        field: "deviceModel",
        labelKey: "works.table_fields.device_model",
        sortable: true,
      },
      {
        key: "type",
        field: "type",
        labelKey: "works.table_fields.work_type",
        sortable: false,
        renderCell: (value) => {
          const type = value as WorkTypeInfo;
          return localize(type.nameRu, type.nameUk);
        },
      },
      {
        key: "createdAt",
        field: "createdAt",
        labelKey: "works.table_fields.created_at",
        sortable: true,
        renderCell: (value) => formatDate(String(value)) ?? "—",
      },
      {
        key: "isPublished",
        field: "isPublished",
        labelKey: "works.table_fields.is_published",
        sortable: false,
        renderCell: (value) => (
          <Badge variant={value ? "default" : "secondary"}>
            {value ? t("works.published") : t("works.draft")}
          </Badge>
        ),
      },
    ],
    [t, localize],
  );

  const [targetWork, setTargetWork] = useState<BackofficeWork | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => worksApi.delete(id),
    onSuccess: () => {
      setTargetWork(null);
      return queryClient.invalidateQueries({ queryKey: queryKeys.works.all });
    },
  });

  const handleDeleteConfirm = useCallback(() => {
    if (targetWork) deleteMutation.mutate(targetWork.id);
  }, [targetWork, deleteMutation]);

  return (
    <>
      <SmartTable
        titleKey="sidebar.works"
        api={worksApi}
        queryKeyFn={queryKeys.works.list}
        searchField="search"
        searchPlaceholder="search_placeholders.works_name"
        columns={columns}
        headerActions={
          <AddButton onClick={() => navigate(WORKS_LINKS.create())} />
        }
        renderRowActions={(item) => (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(WORKS_LINKS.detail(item.id))}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTargetWork(item)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      />

      <DeleteConfirmDialog
        isOpen={targetWork !== null}
        onOpenChange={(open) => {
          if (!open) setTargetWork(null);
        }}
        title={t("works.actions.delete")}
        description={t("works.actions.delete_confirm")}
        cancelLabel={t("works.actions.cancel")}
        confirmLabel={t("works.actions.delete")}
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </>
  );
};

export default WorksPage;

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { OrderSearchPreset } from "@/features/backoffice/modules/orders/types.ts";
import { cn } from "@/shared/lib/utils.ts";

export type PresetDisplayMaps = {
  statusMap: Map<number, string>;
  locationMap: Map<number, string>;
  managerMap: Map<number, string>;
};

interface PresetItemProps {
  preset: OrderSearchPreset;
  onDelete: (id: number) => void;
  isDeleting: boolean;
  maps: PresetDisplayMaps;
}

export const PresetItem = ({
  preset,
  onDelete,
  isDeleting,
  maps,
}: PresetItemProps) => {
  const { t } = useTranslation();
  const { filters } = preset;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: preset.id });

  const statusNames =
    filters.status_ids
      ?.map((id) => maps.statusMap.get(id))
      .filter(Boolean)
      .join(", ") ?? "";

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-start gap-3 py-3 border-b last:border-b-0",
        isDragging && "opacity-50",
      )}
    >
      <button
        type="button"
        className="mt-0.5 shrink-0 cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>

      <div className="flex flex-1 items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold">{preset.name}</span>
          <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
            {statusNames && (
              <span>
                {t("orders.filterSettings.statusesLabel")}: {statusNames}
              </span>
            )}
            {filters.location_id != null && (
              <span>
                {t("orders.filterSettings.locationLabel")}:{" "}
                {maps.locationMap.get(filters.location_id)}
              </span>
            )}
            {filters.is_urgent != null && (
              <span className="uppercase font-medium tracking-wide">
                {t("orders.filterSettings.urgentLabel")}
              </span>
            )}
            {filters.any_match && (
              <span>
                {t("orders.filterSettings.anyMatchLabel")}: {filters.any_match}
              </span>
            )}
            {filters.manager_id != null && (
              <span>
                {t("orders.filterSettings.managerLabel")}:{" "}
                {maps.managerMap.get(filters.manager_id)}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDelete(preset.id)}
          disabled={isDeleting}
          className="shrink-0 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
};

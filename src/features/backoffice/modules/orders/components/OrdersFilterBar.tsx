import { FunnelPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useOrderSearchPresets } from "@/features/backoffice/modules/orders/hooks/useOrderSearchPresets.ts";
import { ORDERS_LINKS } from "@/features/backoffice/modules/orders/navigation.ts";
import type { OrderPresetFilters } from "@/features/backoffice/modules/orders/types.ts";
import { cn } from "@/shared/lib/utils.ts";

const FILTER_KEYS = [
  "status_id",
  "status_ids[]",
  "location_id",
  "is_urgent",
  "manager_id",
  "any_match",
] as const;

function presetToParams(filters: OrderPresetFilters): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.status_ids?.length)
    params.status_id = filters.status_ids.join(",");
  if (filters.location_id != null)
    params.location_id = String(filters.location_id);
  if (filters.manager_id != null)
    params.manager_id = String(filters.manager_id);
  if (filters.is_urgent != null) params.is_urgent = String(filters.is_urgent);
  if (filters.any_match) params.any_match = filters.any_match;
  return params;
}

function isPresetActive(
  filters: OrderPresetFilters,
  searchParams: URLSearchParams,
): boolean {
  const preset = presetToParams(filters);
  for (const [key, value] of Object.entries(preset)) {
    if (searchParams.get(key) !== value) return false;
  }
  for (const key of FILTER_KEYS) {
    if (!(key in preset) && searchParams.has(key)) return false;
  }
  return true;
}

interface FilterTabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const FilterTab = ({ label, active, onClick }: FilterTabProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "pb-2 text-sm whitespace-nowrap transition-colors focus:outline-none border-b-2 -mb-px",
      active
        ? "text-foreground font-medium border-primary"
        : "text-muted-foreground hover:text-foreground border-transparent",
    )}
  >
    {label}
  </button>
);

export const OrdersFilterBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { presets } = useOrderSearchPresets();

  const isAll = FILTER_KEYS.every((key) => !searchParams.has(key));

  const applyFilter = (extra: Record<string, string>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      FILTER_KEYS.forEach((key) => next.delete(key));
      next.delete("page");
      Object.entries(extra).forEach(([k, v]) => next.set(k, v));
      return next;
    });
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex items-end gap-5 border-b min-w-max">
        <button
          type="button"
          onClick={() => navigate(ORDERS_LINKS.filterSettings())}
          className="pb-2 -mb-px text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
        >
          <FunnelPlus className="size-5" />
        </button>

        <FilterTab
          label={t("orders.filters.all")}
          active={isAll}
          onClick={() => applyFilter({})}
        />

        {presets.map((preset) => (
          <FilterTab
            key={preset.id}
            label={preset.name}
            active={isPresetActive(preset.filters, searchParams)}
            onClick={() => applyFilter(presetToParams(preset.filters))}
          />
        ))}
      </div>
    </div>
  );
};

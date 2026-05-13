import { FunnelPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import { ORDERS_LINKS } from "@/features/backoffice/modules/orders/navigation.ts";
import { cn } from "@/shared/lib/utils.ts";

const SCHASTLIVAYA_LOCATION_ID = "1";

const ACTIVE_STATUS_IDS = [1, 2, 3, 4, 5, 6, 7];
const ACTIVE_STATUS_VALUE = ACTIVE_STATUS_IDS.join(",");

const STATUS_TABS = [
  { id: 7, labelKey: "orders.filters.statuses.ready" },
  { id: 4, labelKey: "orders.filters.statuses.negotiation" },
  { id: 5, labelKey: "orders.filters.statuses.waiting_part" },
  { id: 2, labelKey: "orders.filters.statuses.in_progress" },
  { id: 6, labelKey: "orders.filters.statuses.with_partners" },
] as const;

const FilterTab = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
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

  const currentStatusIds = searchParams.get("status_ids[]");
  const currentStatusId = searchParams.get("status_id");
  const currentLocationId = searchParams.get("location_id");
  const currentIsUrgent = searchParams.get("is_urgent");

  const isAll =
    !currentStatusIds &&
    !currentStatusId &&
    !currentLocationId &&
    !currentIsUrgent;

  const applyFilter = (extra: Record<string, string>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("status_ids[]");
      next.delete("status_id");
      next.delete("location_id");
      next.delete("is_urgent");
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

        <FilterTab
          label={t("orders.filters.schastlivaya")}
          active={currentLocationId === SCHASTLIVAYA_LOCATION_ID}
          onClick={() => applyFilter({ location_id: SCHASTLIVAYA_LOCATION_ID })}
        />

        <FilterTab
          label={t("orders.filters.active")}
          active={currentStatusId === ACTIVE_STATUS_VALUE}
          onClick={() => applyFilter({ status_id: ACTIVE_STATUS_VALUE })}
        />

        <FilterTab
          label={t("orders.filters.urgent")}
          active={currentIsUrgent === "1"}
          onClick={() => applyFilter({ is_urgent: "1" })}
        />

        {STATUS_TABS.map((tab) => (
          <FilterTab
            key={tab.id}
            label={t(tab.labelKey)}
            active={currentStatusIds === String(tab.id)}
            onClick={() => applyFilter({ "status_ids[]": String(tab.id) })}
          />
        ))}
      </div>
    </div>
  );
};

import { useTranslation } from "react-i18next";

import type { Location } from "@/features/dictionaries/types.ts";
import { LocationCheckboxGroup } from "@/shared/components/common/LocationCheckboxGroup.tsx";

import { DateRangePresetFilter } from "./DateRangePresetFilter.tsx";

interface StatisticsFilterBarProps {
  from: string;
  to: string;
  locationId: number | null;
  locations: Location[];
  onPeriodChange: (from: string, to: string) => void;
  onLocationChange: (id: number | null) => void;
}

export const StatisticsFilterBar = ({
  from,
  to,
  locationId,
  locations,
  onPeriodChange,
  onLocationChange,
}: StatisticsFilterBarProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <DateRangePresetFilter from={from} to={to} onApply={onPeriodChange} />
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">
          {t("statistics.filters.location")}:
        </span>
        <LocationCheckboxGroup
          locations={locations}
          value={locationId}
          onChange={onLocationChange}
          clearable
        />
      </div>
    </div>
  );
};

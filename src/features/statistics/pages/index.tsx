import { format, startOfMonth } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useDebounce } from "@/shared/hooks/useDebounce.ts";
import { STATISTICS_FILTER_DEBOUNCE_MS } from "@/shared/lib/constants.ts";

import { OrdersSection } from "../components/orders/OrdersSection.tsx";
import { RevenueSection } from "../components/revenue/RevenueSection.tsx";
import { StaffSection } from "../components/staff/StaffSection.tsx";
import { StatisticsFilterBar } from "../components/StatisticsFilterBar.tsx";
import { TopSection } from "../components/top/TopSection.tsx";
import { useStatisticsLocations } from "../hooks/useStatisticsLocations.ts";
import type { StatisticsFilters } from "../types.ts";

const defaultPeriod = (): { from: string; to: string } => {
  const today = new Date();
  return {
    from: format(startOfMonth(today), "yyyy-MM-dd"),
    to: format(today, "yyyy-MM-dd"),
  };
};

const StatisticsPage = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState(defaultPeriod);
  const [locationId, setLocationId] = useState<number | null>(null);
  const { locations } = useStatisticsLocations();

  const debouncedFilters = useDebounce<StatisticsFilters>(
    { ...period, locationId },
    STATISTICS_FILTER_DEBOUNCE_MS,
  );

  return (
    <div className="p-2 sm:p-4 max-w-7xl mx-auto w-full space-y-6">
      <h1 className="text-2xl font-bold">{t("statistics.title")}</h1>
      <StatisticsFilterBar
        from={period.from}
        to={period.to}
        locationId={locationId}
        locations={locations}
        onPeriodChange={(from, to) => setPeriod({ from, to })}
        onLocationChange={setLocationId}
      />
      <RevenueSection filters={debouncedFilters} />
      <OrdersSection filters={debouncedFilters} />
      <TopSection filters={debouncedFilters} />
      <StaffSection filters={debouncedFilters} />
    </div>
  );
};

export default StatisticsPage;

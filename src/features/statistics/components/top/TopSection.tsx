import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/components/ui/button.tsx";

import { useTopStatistics } from "../../hooks/useTopStatistics.ts";
import type { StatisticsFilters } from "../../types.ts";
import { StatisticsSectionGuard } from "../StatisticsSectionGuard.tsx";
import { TopBarList } from "./TopBarList.tsx";
import { TopCustomersTable } from "./TopCustomersTable.tsx";
import { TopLocationsTable } from "./TopLocationsTable.tsx";

const LIMIT_STEPS = [5, 10, 25, 50] as const;

interface TopSectionProps {
  filters: StatisticsFilters;
}

export const TopSection = ({ filters }: TopSectionProps) => {
  const { t } = useTranslation();
  const [limit, setLimit] = useState<number>(LIMIT_STEPS[0]);
  const { top, isLoading, isError, error, refetch } = useTopStatistics(
    filters,
    limit,
  );

  const isEmpty =
    !!top &&
    top.manufacturers.length === 0 &&
    top.deviceTypes.length === 0 &&
    top.customers.length === 0;

  const nextLimit = LIMIT_STEPS.find((step) => step > limit);
  const canShowMore = nextLimit !== undefined;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{t("statistics.top.title")}</h2>
      <StatisticsSectionGuard
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={isEmpty}
        onRetry={refetch}
      >
        {top && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <TopBarList
                title={t("statistics.top.manufacturers")}
                items={top.manufacturers.map((manufacturer) => ({
                  label: manufacturer.value,
                  value: manufacturer.count,
                  formattedValue: String(manufacturer.count),
                }))}
              />
              <TopBarList
                title={t("statistics.top.device_types")}
                items={top.deviceTypes.map((deviceType) => ({
                  label: deviceType.value,
                  value: deviceType.count,
                  formattedValue: String(deviceType.count),
                }))}
              />
            </div>
            {canShowMore && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setLimit(nextLimit)}
              >
                {t("statistics.top.show_more")}
              </Button>
            )}
            <TopCustomersTable customers={top.customers} />
            <TopLocationsTable locations={top.locations} />
          </div>
        )}
      </StatisticsSectionGuard>
    </section>
  );
};

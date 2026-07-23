import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/shared/components/ui/card.tsx";

import { useRevenueStatistics } from "../../hooks/useRevenueStatistics.ts";
import type { Granularity, StatisticsFilters } from "../../types.ts";
import { StatisticsSectionGuard } from "../StatisticsSectionGuard.tsx";
import { GranularitySelect } from "./GranularitySelect.tsx";
import { RevenueChart } from "./RevenueChart.tsx";
import { RevenueKpiTiles } from "./RevenueKpiTiles.tsx";

interface RevenueSectionProps {
  filters: StatisticsFilters;
}

export const RevenueSection = ({ filters }: RevenueSectionProps) => {
  const { t } = useTranslation();
  const [granularity, setGranularity] = useState<Granularity | undefined>(
    undefined,
  );
  const { revenue, isLoading, isError, error, refetch } = useRevenueStatistics(
    filters,
    granularity,
  );

  const isEmpty =
    !!revenue && revenue.payments.count === 0 && revenue.accrued.orders === 0;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{t("statistics.revenue.title")}</h2>
      <StatisticsSectionGuard
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={isEmpty}
        onRetry={refetch}
      >
        {revenue && (
          <div className="space-y-4">
            <RevenueKpiTiles revenue={revenue} />
            <Card>
              <CardContent className="space-y-2 p-4">
                <RevenueChart series={revenue.series} />
                <div className="flex justify-end">
                  <GranularitySelect
                    value={granularity}
                    placeholder={revenue.granularity}
                    onChange={setGranularity}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </StatisticsSectionGuard>
    </section>
  );
};

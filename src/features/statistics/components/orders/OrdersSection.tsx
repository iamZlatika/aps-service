import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/shared/components/ui/card.tsx";

import { useOrdersStatistics } from "../../hooks/useOrdersStatistics.ts";
import type { StatisticsFilters } from "../../types.ts";
import { StatisticsSectionGuard } from "../StatisticsSectionGuard.tsx";
import { OrdersKpiTiles } from "./OrdersKpiTiles.tsx";
import { OrdersStatusList } from "./OrdersStatusList.tsx";

interface OrdersSectionProps {
  filters: StatisticsFilters;
}

export const OrdersSection = ({ filters }: OrdersSectionProps) => {
  const { t } = useTranslation();
  const { orders, isLoading, isError, error, refetch } =
    useOrdersStatistics(filters);

  // Snapshot fields (status_snapshot) reflect "right now", independent of the
  // selected period — an empty period can still have open/overdue orders, so
  // only treat the section as empty when literally nothing exists in either half.
  const isEmpty =
    !!orders &&
    orders.new === 0 &&
    orders.closed === 0 &&
    orders.statusSnapshot.length === 0;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{t("statistics.orders.title")}</h2>
      <StatisticsSectionGuard
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={isEmpty}
        onRetry={refetch}
      >
        {orders && (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
            {orders.statusSnapshot.length > 0 && (
              <Card className="lg:w-80 lg:shrink-0">
                <CardContent className="p-4">
                  <OrdersStatusList statusSnapshot={orders.statusSnapshot} />
                </CardContent>
              </Card>
            )}
            <div className="lg:flex-1">
              <OrdersKpiTiles orders={orders} />
            </div>
          </div>
        )}
      </StatisticsSectionGuard>
    </section>
  );
};

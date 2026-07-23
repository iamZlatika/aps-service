import { useTranslation } from "react-i18next";

import type { OrdersStatistics } from "../../types.ts";
import { KpiTile } from "../KpiTile.tsx";

interface OrdersKpiTilesProps {
  orders: OrdersStatistics;
}

export const OrdersKpiTiles = ({ orders }: OrdersKpiTilesProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-3">
      <KpiTile label={t("statistics.orders.new")}>{orders.new}</KpiTile>
      <KpiTile label={t("statistics.orders.closed")}>{orders.closed}</KpiTile>
      <KpiTile label={t("statistics.orders.overdue")} isNowLabel>
        {orders.overdue}
      </KpiTile>
      <KpiTile label={t("statistics.orders.avg_repair_days")}>
        {orders.avgRepairDays ?? "—"}
      </KpiTile>
    </div>
  );
};

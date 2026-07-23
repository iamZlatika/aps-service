import { useTranslation } from "react-i18next";

import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";

import type { RevenueStatistics } from "../../types.ts";
import { KpiTile } from "../KpiTile.tsx";

interface RevenueKpiTilesProps {
  revenue: RevenueStatistics;
}

export const RevenueKpiTiles = ({ revenue }: RevenueKpiTilesProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <KpiTile label={t("statistics.revenue.payments_total")}>
        <MoneyAmount value={revenue.payments.total} />
      </KpiTile>
      <KpiTile label={t("statistics.revenue.payments_cash")}>
        <MoneyAmount value={revenue.payments.cash} />
      </KpiTile>
      <KpiTile label={t("statistics.revenue.payments_card")}>
        <MoneyAmount value={revenue.payments.card} />
      </KpiTile>
      <KpiTile label={t("statistics.revenue.turnover")}>
        <MoneyAmount value={revenue.accrued.turnover} />
      </KpiTile>
      <KpiTile label={t("statistics.revenue.margin")}>
        <MoneyAmount value={revenue.accrued.margin} />
      </KpiTile>
      <KpiTile label={t("statistics.revenue.cost")}>
        <MoneyAmount value={revenue.accrued.cost} />
      </KpiTile>
    </div>
  );
};

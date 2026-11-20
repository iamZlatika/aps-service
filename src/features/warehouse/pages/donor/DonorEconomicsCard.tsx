import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import { InfoField } from "@/features/warehouse/components/InfoField.tsx";
import type { DonorEconomics } from "@/features/warehouse/types.ts";
import { HintTooltip } from "@/shared/components/common/HintTooltip.tsx";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { Card, CardContent } from "@/shared/components/ui/card.tsx";

interface DonorEconomicsCardProps {
  economics: DonorEconomics;
}

interface LabelWithHintProps {
  label: string;
  hint: string;
}

const LabelWithHint = ({ label, hint }: LabelWithHintProps) => (
  <span className="inline-flex items-center gap-1">
    {label}
    <HintTooltip hint={hint}>
      <Info className="h-3.5 w-3.5" />
    </HintTooltip>
  </span>
);

/**
 * All five numbers, to be judged on real donors. "Recovered by parts" compares
 * cost with cost — it is never called a profit; the profit is `profit`.
 */
export const DonorEconomicsCard = ({ economics }: DonorEconomicsCardProps) => {
  const { t } = useTranslation();

  return (
    <Card className="p-2 sm:p-6">
      <CardContent className="flex flex-col gap-4 p-0">
        <h2 className="text-lg font-semibold">
          {t("warehouse.economics.title")}
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <InfoField label={t("warehouse.economics.acquisitionCost")}>
            <MoneyAmount value={economics.acquisitionCost} />
          </InfoField>
          <InfoField label={t("warehouse.economics.investmentsTotal")}>
            <MoneyAmount value={economics.investmentsTotal} />
          </InfoField>
          <InfoField label={t("warehouse.economics.totalCost")}>
            <MoneyAmount value={economics.totalCost} />
          </InfoField>
          <InfoField
            label={
              <LabelWithHint
                label={t("warehouse.economics.partsCostRecovered")}
                hint={t("warehouse.economics.partsCostRecoveredHint")}
              />
            }
          >
            <MoneyAmount value={economics.partsCostRecovered} />
          </InfoField>
          <InfoField
            label={
              <LabelWithHint
                label={t("warehouse.economics.revenue")}
                hint={t("warehouse.economics.revenueHint")}
              />
            }
          >
            <MoneyAmount value={economics.revenue} />
          </InfoField>
          <InfoField label={t("warehouse.economics.profit")}>
            <MoneyAmount value={economics.profit} />
          </InfoField>
        </div>
      </CardContent>
    </Card>
  );
};

import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { useOrderPaymentsSummary } from "@/features/billing/hooks/useOrderPaymentsSummary.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { Card, CardContent, CardTitle } from "@/shared/components/ui/card.tsx";

interface SummaryCardProps {
  label: string;
  children: ReactNode;
}

const SummaryCard = ({ label, children }: SummaryCardProps) => (
  <Card>
    <CardContent className="p-4 flex flex-col gap-1">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {label}
      </CardTitle>
      <div className="text-xl font-bold">{children}</div>
    </CardContent>
  </Card>
);

export const OrderPaymentsSummaryCards = () => {
  const { t } = useTranslation();
  const { summary, isLoading } = useOrderPaymentsSummary();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-4">
      <SummaryCard label={t("billing.order_payments.summary.total")}>
        <MoneyAmount value={isLoading ? "0" : (summary?.total ?? "0")} />
      </SummaryCard>
      <SummaryCard label={t("billing.order_payments.summary.cash")}>
        <MoneyAmount value={isLoading ? "0" : (summary?.cash ?? "0")} />
      </SummaryCard>
      <SummaryCard label={t("billing.order_payments.summary.card")}>
        <MoneyAmount value={isLoading ? "0" : (summary?.card ?? "0")} />
      </SummaryCard>
      <SummaryCard label={t("billing.order_payments.summary.count")}>
        {isLoading ? "—" : (summary?.count ?? 0)}
      </SummaryCard>
    </div>
  );
};

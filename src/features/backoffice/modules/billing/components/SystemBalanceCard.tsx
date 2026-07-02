import { useTranslation } from "react-i18next";

import { useSystemBalance } from "@/features/backoffice/modules/billing/hooks/useSystemBalance.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { Card, CardContent, CardTitle } from "@/shared/components/ui/card.tsx";

export const SystemBalanceCard = () => {
  const { t } = useTranslation();
  const { systemBalance, isLoading } = useSystemBalance();

  if (isLoading || !systemBalance) return null;

  return (
    <Card className="border-primary bg-primary/5 mb-4">
      <CardContent className="p-6 flex items-center justify-between gap-4">
        <CardTitle className="text-base font-medium">
          {t("billing.system_balance.title")}
        </CardTitle>
        <MoneyAmount
          value={systemBalance.amount}
          className="text-2xl font-bold"
        />
      </CardContent>
    </Card>
  );
};

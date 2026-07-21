import { useTranslation } from "react-i18next";

import { ABILITIES } from "@/features/auth/abilities.ts";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { useSystemBalance } from "@/features/billing/hooks/useSystemBalance.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { Card, CardContent, CardTitle } from "@/shared/components/ui/card.tsx";

interface SystemBalanceCardProps {
  onAdjust?: () => void;
}

export const SystemBalanceCard = ({ onAdjust }: SystemBalanceCardProps) => {
  const { t } = useTranslation();
  const { can } = useAuth();
  const { systemBalance, isLoading } = useSystemBalance();

  if (isLoading || !systemBalance) return null;

  return (
    <Card className="border-primary bg-primary/5 mb-4">
      <CardContent className="p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base font-medium">
          {t("billing.system_balance.title")}
        </CardTitle>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <MoneyAmount
            value={systemBalance.amount}
            className="text-2xl font-bold"
          />
          {onAdjust && can(ABILITIES.BILLING_BALANCE_ADJUST) && (
            <Button size="sm" onClick={onAdjust}>
              {t("billing.system_balance.adjust_button")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

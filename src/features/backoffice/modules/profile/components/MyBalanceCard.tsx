import { useTranslation } from "react-i18next";

import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { Card, CardContent, CardTitle } from "@/shared/components/ui/card.tsx";
import { formatMoney } from "@/shared/lib/utils.ts";

interface MyBalanceCardProps {
  balance: string;
  available?: string;
  onRequestWithdrawal?: () => void;
}

export const MyBalanceCard = ({
  balance,
  available,
  onRequestWithdrawal,
}: MyBalanceCardProps) => {
  const { t } = useTranslation();

  return (
    <Card className="border-primary bg-primary/5 mb-4">
      <CardContent className="p-6 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-base font-medium">
            {t("profile.your_balance")}
          </CardTitle>
          <MoneyAmount value={balance} className="text-2xl font-bold" />
        </div>
        {available !== undefined && (
          <div className="flex items-center justify-between gap-4 pt-3 border-t border-primary/20">
            <span className="text-sm text-muted-foreground">
              {t("billing.withdrawal.available", {
                available: formatMoney(available),
              })}
            </span>
            {onRequestWithdrawal && (
              <Button size="sm" onClick={onRequestWithdrawal}>
                {t("billing.withdrawal.request_button")}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

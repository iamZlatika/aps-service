import { TriangleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useSmsBalance } from "@/features/backoffice/modules/sms-integration/hooks/useSmsBalance.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { Card, CardContent, CardTitle } from "@/shared/components/ui/card.tsx";
import { cn } from "@/shared/lib/utils.ts";

export const SmsBalanceCard = () => {
  const { t } = useTranslation();
  const { smsBalance, isLoading, isUnavailable } = useSmsBalance();

  if (isUnavailable) {
    return (
      <Card className="border-muted-foreground/30 bg-muted/30 mb-4">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            {t("smsIntegration.balance.unavailable")}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !smsBalance) return null;

  return (
    <Card
      className={cn(
        "mb-4",
        smsBalance.isLow
          ? "border-orange-500 bg-orange-500/5"
          : "border-primary bg-primary/5",
      )}
    >
      <CardContent className="p-6 flex items-center justify-between gap-4">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          {t("smsIntegration.balance.title")}
          {smsBalance.isLow && (
            <span className="inline-flex items-center gap-1 text-orange-600 text-xs font-semibold">
              <TriangleAlert className="h-3.5 w-3.5" />
              {t("smsIntegration.balance.low")}
            </span>
          )}
        </CardTitle>
        <MoneyAmount
          value={String(smsBalance.amount)}
          className="text-2xl font-bold"
        />
      </CardContent>
    </Card>
  );
};

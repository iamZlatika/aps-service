import { useTranslation } from "react-i18next";

import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { Card, CardContent, CardTitle } from "@/shared/components/ui/card.tsx";

interface MyBalanceCardProps {
  balance: string;
}

export const MyBalanceCard = ({ balance }: MyBalanceCardProps) => {
  const { t } = useTranslation();

  return (
    <Card className="border-primary bg-primary/5 mb-4">
      <CardContent className="p-6 flex items-center justify-between gap-4">
        <CardTitle className="text-base font-medium">
          {t("profile.your_balance")}
        </CardTitle>
        <MoneyAmount value={balance} className="text-2xl font-bold" />
      </CardContent>
    </Card>
  );
};

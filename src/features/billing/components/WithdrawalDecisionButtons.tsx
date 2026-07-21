import { useTranslation } from "react-i18next";

import { useWithdrawalActions } from "@/features/billing/hooks/useWithdrawalActions.ts";
import { Button } from "@/shared/components/ui/button.tsx";

interface WithdrawalDecisionButtonsProps {
  transactionId: number;
}

export const WithdrawalDecisionButtons = ({
  transactionId,
}: WithdrawalDecisionButtonsProps) => {
  const { t } = useTranslation();
  const { approve, reject, isPending } = useWithdrawalActions();

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        disabled={isPending}
        onClick={(e) => {
          e.stopPropagation();
          approve(transactionId);
        }}
      >
        {t("billing.withdrawal.approve")}
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={(e) => {
          e.stopPropagation();
          reject(transactionId);
        }}
      >
        {t("billing.withdrawal.reject")}
      </Button>
    </div>
  );
};

import { memo } from "react";
import { useTranslation } from "react-i18next";

import { HistoryItemWrapper } from "@/features/backoffice/modules/orders/pages/order-page/components/history-sidebar/sections/HistoryItemWrapper.tsx";
import type { HistoryPayment } from "@/features/backoffice/modules/orders/pages/order-page/types.ts";

interface PaymentItemProps {
  item: HistoryPayment;
}

export const PaymentItem = memo(({ item }: PaymentItemProps) => {
  const { t } = useTranslation();

  const userName = item.user?.name ?? "—";
  const isRefund = item.paymentType === "refund";

  return (
    <HistoryItemWrapper date={item.date}>
      <div className="flex flex-wrap items-center gap-1">
        <span className="font-medium">— {userName} —</span>
        {/* no design tokens for payment/refund states yet — intentional */}
        {isRefund ? (
          <span className="text-rose-700">
            {t("orders.history.payment.refunded")} {Math.abs(item.amount)} ₴
          </span>
        ) : (
          <>
            <span className="text-blue-600">
              {t("orders.history.payment.received")}
            </span>
            <span className="text-blue-600">
              {t(`orders.history.payment.types.${item.paymentType}`)}
            </span>
            <span className="text-blue-600 font-medium">{item.amount} ₴</span>
          </>
        )}
      </div>
    </HistoryItemWrapper>
  );
});

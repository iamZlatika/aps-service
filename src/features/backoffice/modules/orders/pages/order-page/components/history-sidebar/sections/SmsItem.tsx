import { memo } from "react";
import { useTranslation } from "react-i18next";

import { HistoryItemWrapper } from "@/features/backoffice/modules/orders/pages/order-page/components/history-sidebar/sections/HistoryItemWrapper.tsx";
import type { HistorySms } from "@/features/backoffice/modules/orders/pages/order-page/types.ts";

interface SmsItemProps {
  item: HistorySms;
}

export const SmsItem = memo(({ item }: SmsItemProps) => {
  const { t } = useTranslation();

  return (
    <HistoryItemWrapper date={item.date}>
      <span className="text-muted-foreground">
        {t("orders.history.sms.ready_sent")}
      </span>
    </HistoryItemWrapper>
  );
});

import { Mail } from "lucide-react";
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
      <span className="flex items-center gap-1 text-teal-600">
        <Mail className="h-3.5 w-3.5" />
        {t("orders.history.sms.ready_sent")}
      </span>
    </HistoryItemWrapper>
  );
});

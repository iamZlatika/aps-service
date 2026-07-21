import { memo } from "react";
import { useTranslation } from "react-i18next";

import { HistoryItemWrapper } from "@/features/orders/pages/order-page/components/history-sidebar/sections/HistoryItemWrapper.tsx";
import type { HistoryCall } from "@/features/orders/pages/order-page/types.ts";

interface CallItemProps {
  item: HistoryCall;
}

export const CallItem = memo(({ item }: CallItemProps) => {
  const { t } = useTranslation();

  if (item.isCalled) {
    return (
      <HistoryItemWrapper date={item.date}>
        <div className="flex flex-wrap items-center gap-1">
          <span className="font-medium">— {item.user?.name ?? "—"} —</span>
          <span className="text-muted-foreground">
            {t("orders.history.call.called")}
          </span>
        </div>
      </HistoryItemWrapper>
    );
  }

  if (item.user) {
    return (
      <HistoryItemWrapper date={item.date}>
        <div className="flex flex-wrap items-center gap-1">
          <span className="font-medium">— {item.user.name} —</span>
          <span className="text-muted-foreground">
            {t("orders.history.call.cancelled")}
          </span>
        </div>
      </HistoryItemWrapper>
    );
  }

  return (
    <HistoryItemWrapper date={item.date}>
      <span className="text-muted-foreground">
        {t("orders.history.call.system_cancelled")}
      </span>
    </HistoryItemWrapper>
  );
});

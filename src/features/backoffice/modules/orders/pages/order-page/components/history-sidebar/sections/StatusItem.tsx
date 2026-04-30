import { memo } from "react";
import { useTranslation } from "react-i18next";

import { useIsUkLocale } from "@/features/backoffice/modules/orders/hooks/useIsUkLocale.ts";
import { HistoryItemWrapper } from "@/features/backoffice/modules/orders/pages/order-page/components/history-sidebar/sections/HistoryItemWrapper.tsx";
import type { HistoryStatus } from "@/features/backoffice/modules/orders/pages/order-page/types.ts";
import { StatusBadge } from "@/shared/components/common/StatusBadge.tsx";

interface StatusItemProps {
  item: HistoryStatus;
}

export const StatusItem = memo(({ item }: StatusItemProps) => {
  const { t } = useTranslation();
  const isUk = useIsUkLocale();

  const statusName = isUk ? item.status.nameUa : item.status.nameRu;
  const userName = item.user?.name ?? "—";

  const isNew = item.status.key === "new";
  const isClosed = item.status.key === "closed";

  const actionKey = isNew
    ? "orders.history.status.created"
    : isClosed
      ? "orders.history.status.closed"
      : "orders.history.status.changed";

  return (
    <HistoryItemWrapper date={item.date}>
      <div className="flex flex-wrap items-center gap-1">
        <span className="font-medium">— {userName} —</span>
        <span className="text-muted-foreground">{t(actionKey)}</span>
        <StatusBadge name={statusName} color={item.status.color} />
      </div>
    </HistoryItemWrapper>
  );
});

import { memo } from "react";
import { useTranslation } from "react-i18next";

import { HistoryItemWrapper } from "@/features/orders/pages/order-page/components/history-sidebar/sections/HistoryItemWrapper.tsx";
import type { HistoryStatus } from "@/features/orders/pages/order-page/types.ts";
import { StatusBadge } from "@/shared/components/common/StatusBadge.tsx";
import { useLocalizedName } from "@/shared/hooks/useLocalizedName.ts";

interface StatusItemProps {
  item: HistoryStatus;
}

export const StatusItem = memo(({ item }: StatusItemProps) => {
  const { t } = useTranslation();
  const getLocalizedName = useLocalizedName();

  const statusName = getLocalizedName(item.status);
  const userName = item.user.name;

  const isNew = item.status.key === "new";
  const isClosed = item.status.key === "closed";
  const requiresContact =
    item.status.key === "waiting_for_approval" || item.status.key === "ready";

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
      {requiresContact && (
        <div className="mt-1 text-orange-500 font-medium">
          {t("orders.history.status.contact_required")}
        </div>
      )}
    </HistoryItemWrapper>
  );
});

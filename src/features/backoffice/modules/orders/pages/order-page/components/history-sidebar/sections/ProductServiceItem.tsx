import { Box, Cog } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { HistoryItemWrapper } from "@/features/backoffice/modules/orders/pages/order-page/components/history-sidebar/sections/HistoryItemWrapper.tsx";
import type {
  HistoryProduct,
  HistoryService,
} from "@/features/backoffice/modules/orders/pages/order-page/types.ts";

interface ProductServiceItemProps {
  item: HistoryProduct | HistoryService;
}

export const ProductServiceItem = memo(({ item }: ProductServiceItemProps) => {
  const { t } = useTranslation();

  const userName = item.user?.name ?? "—";
  const isDeleted = item.event === "deleted";
  const Icon = item.type === "product" ? Box : Cog;
  const actionKey = `orders.history.${item.type}.${item.event}`;
  const labelKey = `orders.history.${item.type}.label`;
  const pcsKey = `orders.history.${item.type}.pcs`;

  return (
    <HistoryItemWrapper date={item.date}>
      <div className="flex flex-wrap items-center gap-1">
        <span className="font-medium">— {userName} —</span>
        {/* no design tokens for added/deleted states yet — intentional */}
        {isDeleted ? (
          <>
            <span className="text-destructive">{t(actionKey)}</span>
            <span className="text-destructive">{t(labelKey)}</span>
            <span className="flex items-center gap-1">
              <Icon className="h-3.5 w-3.5" />
              {item.name}
            </span>
          </>
        ) : (
          <>
            <span className="text-green-600">{t(actionKey)}</span>
            <span className="text-green-600">{t(labelKey)}</span>
            <span className="text-green-600 font-medium">
              {item.quantity} {t(pcsKey)}
            </span>
            <span className="flex items-center gap-1">
              <Icon className="h-3.5 w-3.5" />
              {item.name}
            </span>
          </>
        )}
      </div>
    </HistoryItemWrapper>
  );
});

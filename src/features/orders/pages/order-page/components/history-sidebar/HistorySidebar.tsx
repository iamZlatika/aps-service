import { useTranslation } from "react-i18next";

import { CommentsForm } from "@/features/orders/pages/order-page/components/history-sidebar/CommentsForm.tsx";
import { HistoryItem } from "@/features/orders/pages/order-page/components/history-sidebar/sections/HistoryItem.tsx";
import { buildHistoryItemKey } from "@/features/orders/pages/order-page/services.ts";
import type { OrderHistoryItem } from "@/features/orders/pages/order-page/types.ts";

interface HistorySidebarProps {
  orderId: number;
  history: OrderHistoryItem[];
}

export const HistorySidebar = ({ orderId, history }: HistorySidebarProps) => {
  const { t } = useTranslation();

  return (
    <aside className="w-[20%] min-w-80 max-w-[800px] shrink-0 border-l bg-background flex flex-col h-full">
      <div className="px-4 py-3 border-b">
        <h2 className="font-semibold text-base">{t("orders.history.title")}</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {history.map((historyItem) => (
          <HistoryItem
            key={buildHistoryItemKey(historyItem)}
            item={historyItem}
          />
        ))}
      </div>
      <CommentsForm orderId={orderId} />
    </aside>
  );
};

import { useTranslation } from "react-i18next";

import { CommentsForm } from "@/features/backoffice/modules/orders/pages/order-page/components/history-sidebar/CommentsForm.tsx";
import { CommentItem } from "@/features/backoffice/modules/orders/pages/order-page/components/history-sidebar/sections/CommentItem.tsx";
import { PaymentItem } from "@/features/backoffice/modules/orders/pages/order-page/components/history-sidebar/sections/PaymentItem.tsx";
import { ProductServiceItem } from "@/features/backoffice/modules/orders/pages/order-page/components/history-sidebar/sections/ProductServiceItem.tsx";
import { StatusItem } from "@/features/backoffice/modules/orders/pages/order-page/components/history-sidebar/sections/StatusItem.tsx";
import type { OrderHistoryItem } from "@/features/backoffice/modules/orders/pages/order-page/types.ts";

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
        {history.map((historyItem) => {
          if (historyItem.type === "status") {
            return (
              <StatusItem key={`status-${historyItem.id}`} item={historyItem} />
            );
          }
          if (
            historyItem.type === "product" ||
            historyItem.type === "service"
          ) {
            return (
              <ProductServiceItem
                key={`${historyItem.type}-${historyItem.id}-${historyItem.date}`}
                item={historyItem}
              />
            );
          }
          if (historyItem.type === "payment") {
            return (
              <PaymentItem
                key={`payment-${historyItem.id}`}
                item={historyItem}
              />
            );
          }
          if (historyItem.type === "comment") {
            return (
              <CommentItem
                key={`comment-${historyItem.id}`}
                item={historyItem}
              />
            );
          }
          return null;
        })}
      </div>
      <CommentsForm orderId={orderId} />
    </aside>
  );
};

import { ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { CommentsForm } from "@/features/backoffice/modules/orders/pages/order-page/components/history-sidebar/CommentsForm.tsx";
import { HistoryItem } from "@/features/backoffice/modules/orders/pages/order-page/components/history-sidebar/sections/HistoryItem.tsx";
import { buildHistoryItemKey } from "@/features/backoffice/modules/orders/pages/order-page/services.ts";
import type { OrderHistoryItem } from "@/features/backoffice/modules/orders/pages/order-page/types.ts";
import { useVisualViewportBottom } from "@/shared/hooks/useVisualViewportBottom.ts";
import { cn } from "@/shared/lib/utils.ts";

const STRIP_H = 44;

interface MobileHistoryDrawerProps {
  orderId: number;
  history: OrderHistoryItem[];
}

export const MobileHistoryDrawer = ({
  orderId,
  history,
}: MobileHistoryDrawerProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const bottomOffset = useVisualViewportBottom();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [isOpen]);

  return (
    <div
      className="fixed inset-x-0 z-50 flex flex-col bg-card border-t shadow-[0_-4px_12px_rgba(0,0,0,0.1)] h-[67dvh] transition-transform duration-300 ease-out"
      style={{
        bottom: bottomOffset,
        transform: isOpen
          ? "translateY(0)"
          : `translateY(calc(100% - ${STRIP_H}px))`,
      }}
    >
      <div
        className="relative flex items-center px-4 shrink-0 bg-muted"
        style={{ height: STRIP_H }}
      >
        <span className="text-sm font-semibold">
          {t("orders.history.title")}
        </span>

        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="absolute right-4 -top-8 bg-green-600 hover:bg-green-700 border border-b-0 rounded-t-lg px-3 py-2 shadow-sm transition-colors"
        >
          <ChevronUp
            className={cn(
              "h-4 w-4 text-white transition-transform duration-300",
              isOpen && "rotate-180",
            )}
          />
        </button>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto">
        {history.map((item) => (
          <HistoryItem key={buildHistoryItemKey(item)} item={item} />
        ))}
      </div>

      <CommentsForm orderId={orderId} />
    </div>
  );
};

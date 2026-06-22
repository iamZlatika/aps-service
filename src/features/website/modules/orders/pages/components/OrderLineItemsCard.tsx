import { type ReactNode } from "react";

import { OrderSectionCard } from "@/features/website/modules/orders/pages/components/OrderSectionCard";
import { type OrderLineItem } from "@/features/website/modules/orders/types";

interface OrderLineItemsCardProps {
  icon: ReactNode;
  title: string;
  items: OrderLineItem[];
  emptyText: string;
}

export const OrderLineItemsCard = ({
  icon,
  title,
  items,
  emptyText,
}: OrderLineItemsCardProps) => {
  const total = items.reduce(
    (sum, item) => sum + (parseFloat(item.sum) || 0),
    0,
  );

  return (
    <OrderSectionCard
      icon={icon}
      title={title}
      aside={items.length > 0 ? `${total} ₴` : undefined}
    >
      {items.length === 0 ? (
        <p className="py-[22px] text-center text-[13px] text-ws-ink-mute">
          {emptyText}
        </p>
      ) : (
        items.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex items-baseline gap-3.5 border-b border-ws-line-soft py-3.5 last:border-b-0"
          >
            <span className="min-w-0 flex-1 text-[14px] font-medium leading-[1.4] text-ws-ink">
              {item.name}
            </span>
            <span className="whitespace-nowrap text-[12.5px] tabular-nums text-ws-ink-mute">
              ×{item.quantity}
            </span>
            <span className="whitespace-nowrap text-[14px] font-bold tabular-nums text-ws-ink">
              {item.sum} ₴
            </span>
          </div>
        ))
      )}
    </OrderSectionCard>
  );
};

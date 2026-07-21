import { memo } from "react";

import { CallItem } from "@/features/orders/pages/order-page/components/history-sidebar/sections/CallItem.tsx";
import { CommentItem } from "@/features/orders/pages/order-page/components/history-sidebar/sections/CommentItem.tsx";
import { PaymentItem } from "@/features/orders/pages/order-page/components/history-sidebar/sections/PaymentItem.tsx";
import { ProductServiceItem } from "@/features/orders/pages/order-page/components/history-sidebar/sections/ProductServiceItem.tsx";
import { SmsItem } from "@/features/orders/pages/order-page/components/history-sidebar/sections/SmsItem.tsx";
import { StatusItem } from "@/features/orders/pages/order-page/components/history-sidebar/sections/StatusItem.tsx";
import type { OrderHistoryItem } from "@/features/orders/pages/order-page/types.ts";
import { assertNever } from "@/shared/lib/assertNever.ts";

interface HistoryItemProps {
  item: OrderHistoryItem;
}

export const HistoryItem = memo(({ item }: HistoryItemProps) => {
  if (item.type === "status") {
    return <StatusItem item={item} />;
  }
  if (item.type === "product" || item.type === "service") {
    return <ProductServiceItem item={item} />;
  }
  if (item.type === "payment") {
    return <PaymentItem item={item} />;
  }
  if (item.type === "comment") {
    return <CommentItem item={item} />;
  }
  if (item.type === "call") {
    return <CallItem item={item} />;
  }
  if (item.type === "sms") {
    return <SmsItem item={item} />;
  }
  return assertNever(item);
});

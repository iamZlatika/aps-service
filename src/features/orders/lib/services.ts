import {
  ORDER_ITEM_ACTIONS,
  type OrderItemAction,
} from "@/features/orders/types";

export function applyItemAction<T extends { id: number }>(
  list: T[],
  item: T,
  action: OrderItemAction,
): T[] {
  if (action === ORDER_ITEM_ACTIONS.DELETED) {
    return list.filter((i) => i.id !== item.id);
  }
  const idx = list.findIndex((i) => i.id === item.id);
  if (idx === -1) return [...list, item];
  const updated = [...list];
  updated[idx] = item;
  return updated;
}

import type {
  HistoryComment,
  HistoryPayment,
  HistoryProduct,
  HistoryService,
  HistoryStatus,
  OrderHistoryItem,
} from "@/features/backoffice/modules/orders/pages/order-page/types.ts";
import type {
  OrderComment,
  OrderInfo,
  OrderPayment,
  OrderProduct,
  OrderService,
  StatusHistoryItem,
} from "@/features/backoffice/modules/orders/types.ts";

export function mapStatusHistory(items: StatusHistoryItem[]): HistoryStatus[] {
  return items.map((item) => ({
    type: "status" as const,
    id: item.id,
    date: item.createdAt,
    user: item.changedByUser,
    status: item.status,
  }));
}

export function mapProducts(items: OrderProduct[]): HistoryProduct[] {
  return items.flatMap((item) => {
    const base = {
      type: "product" as const,
      id: item.id,
      name: item.name,
      price: parseFloat(item.price) || 0,
      purchasePrice: parseFloat(item.purchasePrice ?? "0") || 0,
      quantity: item.quantity,
    };

    const events: HistoryProduct[] = [
      {
        ...base,
        date: item.createdAt,
        user: item.manager ?? undefined,
        event: "added",
      },
    ];

    if (item.deletedAt !== null) {
      events.push({
        ...base,
        date: item.deletedAt,
        user: item.deletedByUser ?? item.manager ?? undefined,
        event: "deleted",
      });
    }

    return events;
  });
}

export function mapServices(items: OrderService[]): HistoryService[] {
  return items.flatMap((item) => {
    const base = {
      type: "service" as const,
      id: item.id,
      name: item.name,
      price: parseFloat(item.price) || 0,
      costPrice: parseFloat(item.costPrice ?? "0") || 0,
      quantity: item.quantity,
    };

    const events: HistoryService[] = [
      {
        ...base,
        date: item.createdAt,
        user: item.manager ?? undefined,
        event: "added",
      },
    ];

    if (item.deletedAt !== null) {
      events.push({
        ...base,
        date: item.deletedAt,
        user: item.deletedByUser ?? item.manager ?? undefined,
        event: "deleted",
      });
    }

    return events;
  });
}

export function mapComments(items: OrderComment[]): HistoryComment[] {
  return items.map((item) => ({
    type: "comment" as const,
    id: item.id,
    date: item.createdAt,
    user: item.user,
    text: item.body ?? undefined,
    image: item.imageUrl ?? undefined,
  }));
}

export function mapPayments(items: OrderPayment[]): HistoryPayment[] {
  return items.map((item) => ({
    type: "payment" as const,
    id: item.id,
    date: item.createdAt,
    user: item.manager ?? undefined,
    paymentType: item.type,
    amount: parseFloat(item.amount) || 0,
    note: item.note ?? undefined,
  }));
}

export function buildOrderHistory(
  order: Pick<
    OrderInfo,
    "statusHistory" | "products" | "services" | "comments" | "payments"
  >,
): OrderHistoryItem[] {
  return [
    ...mapStatusHistory(order.statusHistory),
    ...mapProducts(order.products),
    ...mapServices(order.services),
    ...mapComments(order.comments),
    ...mapPayments(order.payments),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

import type {
  HistoryCall,
  HistoryComment,
  HistoryPayment,
  HistoryProduct,
  HistoryService,
  HistorySms,
  HistoryStatus,
  OrderHistoryItem,
} from "@/features/orders/pages/order-page/types.ts";
import type {
  CallHistoryItem,
  OrderComment,
  OrderInfo,
  OrderPayment,
  OrderProduct,
  OrderService,
  StatusHistoryItem,
} from "@/features/orders/types.ts";

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
        user: item.createdByUser ?? item.manager,
        event: "added",
      },
    ];

    if (item.deletedAt) {
      events.push({
        ...base,
        date: item.deletedAt,
        user: item.deletedByUser ?? item.manager,
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
        user: item.createdByUser ?? item.manager,
        event: "added",
      },
    ];

    if (item.deletedAt) {
      events.push({
        ...base,
        date: item.deletedAt,
        user: item.deletedByUser ?? item.manager,
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
  return items.flatMap((item) => {
    const base = {
      type: "payment" as const,
      id: item.id,
      paymentType: item.type,
      amount: parseFloat(item.amount) || 0,
      note: item.note ?? undefined,
    };

    const events: HistoryPayment[] = [
      {
        ...base,
        date: item.createdAt,
        user: item.manager,
        event: "added",
      },
    ];

    if (item.deletedAt) {
      events.push({
        ...base,
        date: item.deletedAt,
        user: item.deletedByUser ?? item.manager,
        event: "deleted",
      });
    }

    return events;
  });
}

export function mapCallHistory(items: CallHistoryItem[]): HistoryCall[] {
  return items.map((item) => ({
    type: "call" as const,
    id: item.id,
    date: item.createdAt,
    user: item.user,
    isCalled: item.isCalled,
  }));
}

export function mapReadySms(readySmsSentAt: string | null): HistorySms[] {
  return readySmsSentAt ? [{ type: "sms" as const, date: readySmsSentAt }] : [];
}

export function buildHistoryItemKey(item: OrderHistoryItem): string {
  if (item.type === "status") return `status-${item.id}`;
  if (item.type === "product" || item.type === "service") {
    return `${item.type}-${item.id}-${item.event}`;
  }
  if (item.type === "payment") return `payment-${item.id}-${item.event}`;
  if (item.type === "comment") return `comment-${item.id}`;
  if (item.type === "call") return `call-${item.id}`;
  return "sms-ready-sent";
}

export function buildOrderHistory(
  order: Pick<
    OrderInfo,
    | "statusHistory"
    | "products"
    | "services"
    | "comments"
    | "payments"
    | "callHistory"
    | "readySmsSentAt"
  >,
): OrderHistoryItem[] {
  return [
    ...mapStatusHistory(order.statusHistory),
    ...mapProducts(order.products),
    ...mapServices(order.services),
    ...mapComments(order.comments),
    ...mapPayments(order.payments),
    ...mapCallHistory(order.callHistory),
    ...mapReadySms(order.readySmsSentAt),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

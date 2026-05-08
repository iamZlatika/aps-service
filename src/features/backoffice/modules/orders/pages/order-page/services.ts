import type {
  HistoryCall,
  HistoryComment,
  HistoryPayment,
  HistoryProduct,
  HistoryService,
  HistoryStatus,
  OrderHistoryItem,
} from "@/features/backoffice/modules/orders/pages/order-page/types.ts";
import type {
  CallHistoryItem,
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

export function buildOrderHistory(
  order: Pick<
    OrderInfo,
    | "statusHistory"
    | "products"
    | "services"
    | "comments"
    | "payments"
    | "callHistory"
  >,
): OrderHistoryItem[] {
  return [
    ...mapStatusHistory(order.statusHistory),
    ...mapProducts(order.products),
    ...mapServices(order.services),
    ...mapComments(order.comments),
    ...mapPayments(order.payments),
    ...mapCallHistory(order.callHistory),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

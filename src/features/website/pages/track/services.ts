import type {
  OrderHistoryItem,
  OrderHistoryPayment,
  OrderHistoryProduct,
  OrderHistoryService,
  OrderHistoryStatus,
  Track,
} from "@/features/website/types";

function mapStatusHistory(items: Track["statusHistory"]): OrderHistoryStatus[] {
  return items.map((item, index) => ({
    type: "status" as const,
    id: `status-${index}`,
    date: item.createdAt,
    status: item.status,
  }));
}

function mapPayments(items: Track["payments"]): OrderHistoryPayment[] {
  return items.map((item, index) => ({
    type: "payment" as const,
    id: `payment-${index}`,
    date: item.createdAt,
    paymentType: item.type,
    method: item.method,
    amount: parseFloat(item.amount) || 0,
  }));
}

function mapProducts(items: Track["products"]): OrderHistoryProduct[] {
  return items.flatMap((item, index) => {
    const base = {
      type: "product" as const,
      id: `product-${index}`,
      name: item.name,
      price: parseFloat(item.price) || 0,
      quantity: item.quantity,
      sum: parseFloat(item.sum) || 0,
    };

    const events: OrderHistoryProduct[] = [
      { ...base, date: item.createdAt, event: "added" },
    ];

    if (item.deletedAt) {
      events.push({
        ...base,
        id: `product-${index}-deleted`,
        date: item.deletedAt,
        event: "deleted",
      });
    }

    return events;
  });
}

function mapServices(items: Track["services"]): OrderHistoryService[] {
  return items.flatMap((item, index) => {
    const base = {
      type: "service" as const,
      id: `service-${index}`,
      name: item.name,
      price: parseFloat(item.price) || 0,
      quantity: item.quantity,
      sum: parseFloat(item.sum) || 0,
    };

    const events: OrderHistoryService[] = [
      { ...base, date: item.createdAt, event: "added" },
    ];

    if (item.deletedAt) {
      events.push({
        ...base,
        id: `service-${index}-deleted`,
        date: item.deletedAt,
        event: "deleted",
      });
    }

    return events;
  });
}

export function buildOrderHistory(
  track: Pick<Track, "statusHistory" | "payments" | "products" | "services">,
): OrderHistoryItem[] {
  return [
    ...mapStatusHistory(track.statusHistory),
    ...mapPayments(track.payments),
    ...mapProducts(track.products),
    ...mapServices(track.services),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

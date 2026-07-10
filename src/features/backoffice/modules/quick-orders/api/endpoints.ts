const BASE = "/backoffice/quick-orders";

export const QUICK_ORDERS_API = {
  quickOrders: () => `${BASE}/`,
  quickOrder: (id: number) => `${BASE}/${id}`,
} as const;

const BASE = "/backoffice/quick-orders";

export const QUICK_ORDERS_LINKS = {
  root: () => BASE,
  new: () => `${BASE}/new`,
  detail: (id: number) => `${BASE}/${id}`,
} as const;

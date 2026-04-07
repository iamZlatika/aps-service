const BASE = "/backoffice/orders";

export const ORDERS_LINKS = {
  root: () => BASE,
  newOrder: () => `${BASE}/order-new`,
} as const;

const BASE = "/backoffice/orders";

export const ORDERS_LINKS = {
  root: () => BASE,
  newOrder: () => `${BASE}/order-new`,
  filterSettings: () => `${BASE}/order-filter-settings`,
} as const;

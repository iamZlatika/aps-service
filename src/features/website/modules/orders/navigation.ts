const BASE = "/account/orders";

export const CUSTOMER_ORDERS_LINKS = {
  detail: (id: number) => `${BASE}/${id}`,
} as const;

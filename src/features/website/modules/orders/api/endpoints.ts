const BASE = "/api/orders";

export const CUSTOMER_ORDERS_API = {
  orders: () => BASE,
  order: (id: number) => `${BASE}/${id}`,
  downloadDocument: (orderId: number, documentId: number) =>
    `${BASE}/${orderId}/documents/${documentId}/download`,
} as const;

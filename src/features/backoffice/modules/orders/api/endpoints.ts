const BASE = "/backoffice/orders";

export const ORDERS_API = {
  orders: () => `${BASE}`,
  order: (id: number) => `${BASE}/${id}`,
  changeStatus: (id: number) => `${BASE}/${id}/status`,
};

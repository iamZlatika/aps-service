const BASE = "/backoffice/orders";

export const ORDERS_API = {
  orders: () => `${BASE}`,
  order: (id: number) => `${BASE}/${id}`,
  changeStatus: (id: number) => `${BASE}/${id}/status`,
  addComment: (id: number) => `${BASE}/${id}/comments`,
  addProduct: (id: number) => `${BASE}/${id}/products`,
  changeProduct: (orderId: number, productId: number) =>
    `${BASE}/${orderId}/products/${productId}`,
  addService: (id: number) => `${BASE}/${id}/services`,
  changeService: (orderId: number, serviceId: number) =>
    `${BASE}/${orderId}/services/${serviceId}`,
  makePayment: (orderId: number) => `${BASE}/${orderId}/payments`,
};

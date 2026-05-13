const BASE = "/backoffice/orders";

export const ORDERS_API = {
  orders: () => `${BASE}`,
  order: (id: number) => `${BASE}/${id}`,
  changeStatus: (id: number) => `${BASE}/${id}/status`,
  changeIsCalled: (id: number) => `${BASE}/${id}/is-called`,
  changeIsUrgent: (id: number) => `${BASE}/${id}/is-urgent`,
  addComment: (id: number) => `${BASE}/${id}/comments`,
  addProduct: (id: number) => `${BASE}/${id}/products`,
  changeProduct: (orderId: number, productId: number) =>
    `${BASE}/${orderId}/products/${productId}`,
  addService: (id: number) => `${BASE}/${id}/services`,
  changeService: (orderId: number, serviceId: number) =>
    `${BASE}/${orderId}/services/${serviceId}`,
  makePayment: (orderId: number) => `${BASE}/${orderId}/payments`,
  deletePayment: (orderId: number, paymentId: number) =>
    `${BASE}/${orderId}/payments/${paymentId}`,
  downloadDocument: (orderId: number, documentId: number) =>
    `${BASE}/${orderId}/documents/${documentId}/download`,
  addSearchPreset: () => "/backoffice/users/search-presets",
  deleteSearchPreset: (id: number) => `/backoffice/users/search-presets/${id}`,
};

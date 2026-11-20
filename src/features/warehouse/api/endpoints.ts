const BASE = "/backoffice/warehouse";

export const WAREHOUSE_API = {
  items: () => `${BASE}/items`,
  item: (id: number) => `${BASE}/items/${id}`,
  itemStock: (id: number) => `${BASE}/items/${id}/stock`,
  itemPhoto: (id: number) => `${BASE}/items/${id}/photo`,
  donors: () => `${BASE}/donors`,
  donor: (id: number) => `${BASE}/donors/${id}`,
  donorParts: (id: number) => `${BASE}/donors/${id}/parts`,
  donorInvestments: (id: number) => `${BASE}/donors/${id}/investments`,
  donorInvestment: (id: number, investmentId: number) =>
    `${BASE}/donors/${id}/investments/${investmentId}`,
  parts: () => `${BASE}/parts`,
  part: (id: number) => `${BASE}/parts/${id}`,
  partPhoto: (id: number) => `${BASE}/parts/${id}/photo`,
  categories: () => `${BASE}/categories`,
  category: (id: number) => `${BASE}/categories/${id}`,
  storagePlaces: () => `${BASE}/storage-places`,
  storagePlace: (id: number) => `${BASE}/storage-places/${id}`,
  search: () => `${BASE}/search`,
  orderToDonor: (orderId: number) => `/backoffice/orders/${orderId}/to-donor`,
} as const;

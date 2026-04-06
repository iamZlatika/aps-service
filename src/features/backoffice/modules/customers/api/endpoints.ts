const BASE = "/backoffice/customers";

export const CUSTOMERS_API = {
  customers: () => `${BASE}/`,
  customer: (id: number) => `${BASE}/${id}`,
  changeStatus: (id: number) => `${BASE}/${id}/status`,
  changePrimaryPhone: (customerId: number, phoneId: number) =>
    `${BASE}/${customerId}/phones/${phoneId}/set-primary`,
  deleteSecondaryPhone: (customerId: number, phoneId: number) =>
    `${BASE}/${customerId}/phones/${phoneId}`,
  addSecondaryPhone: (customerId: number) => `${BASE}/${customerId}/phones`,
} as const;

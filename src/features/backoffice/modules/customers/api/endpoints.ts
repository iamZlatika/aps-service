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
  changeRating: (id: number) => `${BASE}/${id}/rating`,
  setSmsNotifications: (id: number) => `${BASE}/${id}/sms-notifications`,
  getTelegramLink: (id: number) => `${BASE}/${id}/telegram/generate-link`,
  revokeTelegramLink: (id: number) => `${BASE}/${id}/telegram/revoke-link`,
} as const;

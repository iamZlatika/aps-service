const BASE = "/backoffice/customers";

export const CUSTOMERS_API = {
  listCustomers: () => `${BASE}/`,
} as const;

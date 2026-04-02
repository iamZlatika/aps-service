const BASE = "/backoffice/customers";

export const CUSTOMERS_API = {
  customers: () => `${BASE}/`,
} as const;

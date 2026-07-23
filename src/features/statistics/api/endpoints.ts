const BASE = "/backoffice/statistics";

export const STATISTICS_API = {
  revenue: () => `${BASE}/revenue`,
  orders: () => `${BASE}/orders`,
  top: () => `${BASE}/top`,
  staff: () => `${BASE}/staff`,
} as const;

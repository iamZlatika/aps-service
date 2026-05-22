const BASE = "/api";

export const WEBSITE_API = {
  locations: () => `${BASE}/dictionaries/locations`,
  track: (token: string) => `${BASE}/orders/track/${token}`,
  status: (orderNumber: string) => `${BASE}/orders/status${orderNumber}`,
} as const;

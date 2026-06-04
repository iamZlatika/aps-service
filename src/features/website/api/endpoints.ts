const BASE = "/api";

export const WEBSITE_API = {
  locations: () => `${BASE}/dictionaries/locations`,
  track: (token: string) => `${BASE}/orders/track/${token}`,
  status: (orderNumber: string) => `${BASE}/orders/status/${orderNumber}`,
  landing: () => `${BASE}/landing`,
  priceList: () => `${BASE}/dictionaries/price-list`,
  landingWorks: () => `${BASE}/landing/works`,
} as const;

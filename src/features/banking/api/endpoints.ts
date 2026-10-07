const BASE = "/backoffice/banking";

export const BANKING_API = {
  transactions: () => `${BASE}/transactions`,
} as const;

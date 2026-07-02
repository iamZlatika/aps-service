const BASE = "/backoffice/billing";

export const BILLING_API = {
  transactions: () => `${BASE}/transactions`,
  allTransactions: () => `${BASE}/transactions/all`,
  balances: () => `${BASE}/balances`,
  systemBalance: () => `${BASE}/balance/system`,
} as const;

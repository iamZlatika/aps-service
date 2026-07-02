const BASE = "/backoffice/billing";

export const BILLING_LINKS = {
  myFinances: () => `${BASE}/my`,
  root: () => BASE,
  balances: () => `${BASE}/balances`,
  transactions: () => `${BASE}/transactions`,
  transactionsByUser: (userId: number) =>
    `${BASE}/transactions?user_id=${userId}`,
} as const;

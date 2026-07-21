const BASE = "/billing";

export const BILLING_LINKS = {
  root: () => BASE,
  balances: () => `${BASE}/balances`,
  transactions: () => `${BASE}/transactions`,
  transactionsByUser: (userId: number) =>
    `${BASE}/transactions?user_id=${userId}`,
  withdrawalRequests: () => `${BASE}/withdrawal-requests`,
  orderPayments: () => `${BASE}/order-payments`,
} as const;

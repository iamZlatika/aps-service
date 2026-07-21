const BASE = "/backoffice/billing";

export const BILLING_API = {
  transactions: () => `${BASE}/transactions`,
  allTransactions: () => `${BASE}/transactions/all`,
  balances: () => `${BASE}/balances`,
  systemBalance: () => `${BASE}/balance/system`,
  withdrawals: () => `${BASE}/withdrawals`,
  withdrawalApprove: (id: number) => `${BASE}/withdrawals/${id}/approve`,
  withdrawalReject: (id: number) => `${BASE}/withdrawals/${id}/reject`,
  orderPayments: () => `${BASE}/order-payments`,
  orderPaymentsSummary: () => `${BASE}/order-payments/summary`,
} as const;

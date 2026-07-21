import { type StatusColor, type TransactionStatus } from "@/shared/types.ts";

export const BILLING_DIRECTIONS = {
  ACCRUE: "accrue",
  DEDUCT: "deduct",
} as const;
export type BillingDirection =
  (typeof BILLING_DIRECTIONS)[keyof typeof BILLING_DIRECTIONS];

export const TRANSACTION_STATUS_COLORS: Record<TransactionStatus, StatusColor> =
  {
    completed: "green",
    pending: "gray",
    rejected: "gray",
  };

// Single source of truth for which URL filter keys the order-payments report
// recognizes — shared by the table (via extraFilterKeys) and the summary
// hook (via sanitizeFilters), so both always agree on the same allowed set.
export const ORDER_PAYMENTS_FILTER_KEYS = [
  "created_at[0]",
  "created_at[1]",
  "manager_id",
  "type",
  "method",
  "order_number",
] as const;

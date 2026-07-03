import { type TransactionStatus } from "@/shared/types.ts";

export const BILLING_DIRECTIONS = {
  ACCRUE: "accrue",
  DEDUCT: "deduct",
} as const;
export type BillingDirection =
  (typeof BILLING_DIRECTIONS)[keyof typeof BILLING_DIRECTIONS];

export const TRANSACTION_STATUS_COLORS: Record<TransactionStatus, string> = {
  completed: "green",
  pending: "gray",
  rejected: "gray",
};

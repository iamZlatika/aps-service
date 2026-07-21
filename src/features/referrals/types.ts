import type { Customer } from "@/features/customers/types.ts";
import type { OrderProduct, OrderService } from "@/features/orders/types.ts";
import type { User } from "@/features/users/types.ts";
import type { TransactionStatus } from "@/shared/types.ts";

export type Referral = {
  id: number;
  customer: Customer;
  commissionPercent: number;
  balance: string;
  pendingBalance: string;
  createdBy: User | null;
  createdAt: string;
  updatedAt: string;
};

export type ReferralTransaction = {
  id: number;
  amount: string;
  type: string;
  label: string;
  status: TransactionStatus;
  orderId: number | null;
  orderNumber: string | null;
  orderService: OrderService | null;
  orderProduct: OrderProduct | null;
  createdBy: User | null;
  createdAt: string;
  updatedAt: string;
};

export type NewReferral = {
  customerId: number;
  commissionPercent: number;
};

export type EditReferral = {
  commissionPercent: number;
};

export type NewReferralBalanceTransaction = {
  amount: string;
  description: string;
};

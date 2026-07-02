import type { OrderTransaction } from "@/features/backoffice/modules/orders/types.ts";
import type { User } from "@/features/backoffice/modules/users/types.ts";

export type Transaction = Omit<
  OrderTransaction,
  "orderId" | "orderNumber" | "orderServiceId" | "orderProductId"
> & {
  orderId: number | null;
  orderNumber: string | null;
  orderService: unknown;
  orderProduct: unknown;
  createdBy: User | null;
};

export type Balance = {
  id: number;
  amount: string;
  user: User;
  createdAt: string;
  updatedAt: string;
};

export type SystemBalance = {
  amount: string;
};

export type NewBillingTransaction = {
  userId: number;
  amount: string;
  description: string;
};

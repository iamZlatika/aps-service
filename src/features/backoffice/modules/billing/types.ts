import type {
  OrderProduct,
  OrderService,
  OrderTransaction,
} from "@/features/backoffice/modules/orders/types.ts";
import type { User } from "@/features/backoffice/modules/users/types.ts";

export type Transaction = Omit<
  OrderTransaction,
  "orderId" | "orderNumber" | "orderServiceId" | "orderProductId"
> & {
  orderId: number | null;
  orderNumber: string | null;
  orderService: OrderService | null;
  orderProduct: OrderProduct | null;
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

export type NewWithdrawalRequest = {
  amount: string;
  description?: string;
};

export type NewSystemBalanceTransaction = {
  amount: string;
  description: string;
};

export const SERVICE_VALUE = "service";

export type EmployeeSelectValue = number | typeof SERVICE_VALUE | undefined;

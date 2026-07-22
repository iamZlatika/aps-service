import type {
  OrderPayment,
  OrderProduct,
  OrderService,
  OrderTransaction,
} from "@/features/orders/types.ts";
import type { User } from "@/features/users/types.ts";

export type Transaction = Omit<
  OrderTransaction,
  "orderId" | "orderNumber" | "orderServiceId" | "orderProductId"
> & {
  orderId: number | null;
  orderNumber: string | null;
  orderService: OrderService | null;
  orderProduct: OrderProduct | null;
  createdBy: User | null;
  quickOrderId: number | null;
  quickOrderNumber: string | null;
};

export type Balance = {
  id: number;
  amount: string;
  pendingAmount: string;
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

// Order-payments report row: same fields as an order-embedded OrderPayment
// (id/type/method/amount/note/createdAt), minus soft-delete metadata, plus
// order reference fields and a nullable manager (order-embedded payments
// always have one, report rows may not). orderId/orderNumber are null and
// quickOrderId/quickOrderNumber are filled instead for quick-sale rows.
export type OrderPaymentRecord = Omit<
  OrderPayment,
  "manager" | "deletedAt" | "deletedByUser"
> & {
  orderId: number | null;
  orderNumber: string | null;
  quickOrderId: number | null;
  quickOrderNumber: string | null;
  manager: User | null;
};

export type OrderPaymentsSummary = {
  total: string;
  cash: string;
  card: string;
  count: number;
};

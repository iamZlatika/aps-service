import type { Transaction } from "@/features/backoffice/modules/billing/types.ts";
import type { Location } from "@/features/backoffice/modules/dictionaries/types.ts";
import type {
  OrderProduct,
  OrderService,
} from "@/features/backoffice/modules/orders/types.ts";
import type { NewQuickOrderSchema } from "@/features/backoffice/modules/quick-orders/lib/schema.ts";
import type { User } from "@/features/backoffice/modules/users/types.ts";
import type { PaymentMethodType } from "@/shared/types.ts";

export type QuickOrder = {
  id: number;
  number: string;
  manager: User;
  location: Location | null;
  paymentMethod: PaymentMethodType | null;
  totalPrice: string;
  totalCost: string;
  totalIncome: string;
  createdAt: string;
};

export type QuickOrderDetail = QuickOrder & {
  createdBy: User | null;
  comment: string | null;
  services: OrderService[];
  products: OrderProduct[];
  transactions: Transaction[];
  updatedAt: string;
  deletedAt: string | null;
};

export type NewQuickOrder = NewQuickOrderSchema;

export const QUICK_ORDER_ITEM_TYPES = {
  SERVICE: "service",
  PRODUCT: "product",
} as const;
export type QuickOrderItemType =
  (typeof QUICK_ORDER_ITEM_TYPES)[keyof typeof QUICK_ORDER_ITEM_TYPES];

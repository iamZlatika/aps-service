import type { Customer } from "@/features/backoffice/modules/customers/types.ts";
import type { Location } from "@/features/backoffice/modules/dictionaries/types.ts";
import type { NewOrderSchema } from "@/features/backoffice/modules/orders/lib/schema.ts";
import type { User } from "@/features/backoffice/modules/users/types.ts";
import { type DocumentType } from "@/shared/types.ts";

export type OrderStatus = {
  id: number;
  key: string;
  nameRu: string;
  nameUa: string;
  color: string;
  isSystem: boolean;
};

export type StatusHistoryItem = {
  id: number;
  status: OrderStatus;
  changedByUser: User;
  createdAt: string;
};

export type OrderDocument = {
  id: number;
  type: DocumentType;
  name: string;
  url: string;
  createdAt: string;
};

export type Order = {
  id: number;
  orderNumber: string;
  customer: Customer;
  manager: User;
  assignee: User | null;
  status: OrderStatus;
  issueType: string;
  deviceType: string;
  manufacturer: string;
  deviceModel: string;
  deviceCondition: string | null;
  accessory: string | null;
  devicePassword: string;
  intakeNote: string | null;
  totalPrepayment: string;
  remainingToPay: string;
  dueDate: string;
  estimatedCost: string | null;
  isUrgent: boolean;
  isCalled: boolean;
  location: Location;
  totalCost: string;
  totalIncome: string;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  documents: OrderDocument[];
};

export type NewOrder = NewOrderSchema;

export type OrderComment = {
  id: number;
  user: User;
  body: string | null;
  imageUrl: string | null;
  createdAt: string;
};
export type OrderProduct = {
  id: number;
  user: null | User;
  supplierName: null | string;
  name: string;
  price: string;
  purchasePrice: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
export type newOrderProduct = Omit<
  OrderProduct,
  "id" | "user" | "createdAt" | "updatedAt" | "deletedAt"
>;
export type OrderService = {
  id: number;
  user: null | User;
  repairOperationId: number | null;
  name: string;
  price: string;
  costPrice?: string | null;
  supplierName?: null | string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
export type newOrderService = Omit<
  OrderService,
  "id" | "user" | "createdAt" | "updatedAt" | "deletedAt" | "repairOperationId"
>;

export type OrderLineItem =
  | (OrderProduct & { type: "product" })
  | (OrderService & { type: "service" });

export type OrderPrepayment = {
  id: number;
  amount: string;
  note?: string;
  createdAt: string;
};
export type OrderInfo = Order & {
  location: Location;
  statusHistory: StatusHistoryItem[];
  services: OrderService[];
  products: OrderProduct[];
  comments: OrderComment[];
  prepayments: OrderPrepayment[];
};

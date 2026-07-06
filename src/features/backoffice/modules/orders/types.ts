import { type OrderStatus } from "@/entities/order-status/types";
import {
  type Customer,
  type CustomerInfo,
} from "@/features/backoffice/modules/customers/types.ts";
import type {
  Outsourcer,
  Supplier,
} from "@/features/backoffice/modules/dictionaries/types.ts";
import type { Location } from "@/features/backoffice/modules/dictionaries/types.ts";
import type {
  CallHistoryDto,
  DocumentDto,
  OrderCommentDto,
  OrderDto,
  OrderPaymentDto,
  OrderProductDto,
  OrderServiceDto,
  StatusHistoryItemDto,
} from "@/features/backoffice/modules/orders/api/dto";
import type { NewOrderSchema } from "@/features/backoffice/modules/orders/lib/schema.ts";
import type {
  SearchPreset,
  User,
} from "@/features/backoffice/modules/users/types.ts";
import {
  type DocumentType,
  type PaymentMethodType,
  type PaymentType,
  type TransactionStatus,
} from "@/shared/types.ts";

export type { OrderStatus };

export type StatusHistoryItem = {
  id: number;
  status: OrderStatus;
  changedByUser: User;
  createdAt: string;
};

export type CallHistoryItem = {
  id: number;
  isCalled: boolean;
  user: User | null;
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
  status: OrderStatus;
  issueType: string;
  deviceType: string;
  manufacturer: string;
  deviceModel: string;
  deviceCondition: string | null;
  accessory: string | null;
  devicePassword: string;
  intakeNote: string | null;
  totalPaid: string;
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
  readySmsSentAt: string | null;
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
  manager: User;
  createdByUser: User | null;
  supplier: Supplier | null;
  name: string;
  price: string;
  purchasePrice: string | null;
  quantity: number;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedByUser: User | null;
};
export type NewOrderProduct = Omit<
  OrderProduct,
  | "id"
  | "manager"
  | "createdByUser"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "completedAt"
  | "deletedByUser"
  | "supplier"
> & { managerId: number | null; supplierName: string };
export type OrderService = {
  id: number;
  manager: User;
  createdByUser: User | null;
  repairOperationId: number | null;
  name: string;
  price: string;
  costPrice?: string | null;
  outsourcer: Outsourcer | null;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  deletedByUser: User | null;
};
export type NewOrderService = Omit<
  OrderService,
  | "id"
  | "manager"
  | "createdByUser"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "repairOperationId"
  | "completedAt"
  | "deletedByUser"
  | "outsourcer"
> & { managerId: number | null; outsourcerName: string };

export type OrderItemType = "product" | "service";

export type OrderItem =
  | (OrderProduct & { type: "product" })
  | (OrderService & { type: "service" });

export type OrderPayment = {
  id: number;
  type: PaymentType;
  method: PaymentMethodType;
  amount: string;
  note: string | null;
  manager: User;
  createdAt: string;
  deletedAt: string | null;
  deletedByUser: User | null;
};

export type NewOrderPayment = Omit<
  OrderPayment,
  "id" | "createdAt" | "manager" | "deletedAt" | "deletedByUser"
> & {
  managerId: number;
};
export type OrderTransaction = {
  id: number;
  amount: string;
  type: string;
  label: string;
  status: TransactionStatus;
  user: User | null;
  orderId: number;
  orderNumber: string;
  orderServiceId: number | null;
  orderProductId: number | null;
  createdAt: string;
  updatedAt: string;
};
export type OrderInfo = Omit<Order, "customer"> & {
  customer: CustomerInfo;
  location: Location;
  statusHistory: StatusHistoryItem[];
  services: OrderService[];
  products: OrderProduct[];
  comments: OrderComment[];
  payments: OrderPayment[];
  callHistory: CallHistoryItem[];
  transactions: OrderTransaction[];
};

export type OrderPresetFilters = {
  page: number;
  per_page: number;
  sort_type: string;
  sort_column?: string;
  status_ids?: number[];
  manager_id?: number;
  location_id?: number;
  is_urgent?: number;
  any_match?: string;
};

export type OrderSearchPreset = SearchPreset<OrderPresetFilters>;

export type OrderSocketEvent = {
  data: { order: OrderDto };
};

export type OrderStatusChangedSocketEvent = {
  data: { order: OrderDto; status_history_item: StatusHistoryItemDto };
};

export type OrderCalledChangedSocketEvent = {
  data: { order: OrderDto; call_history_item: CallHistoryDto };
};

export const ORDER_ITEM_ACTIONS = {
  CREATED: "created",
  UPDATED: "updated",
  DELETED: "deleted",
} as const;

export type OrderItemAction =
  (typeof ORDER_ITEM_ACTIONS)[keyof typeof ORDER_ITEM_ACTIONS];

export type OrderPaymentSocketEvent = {
  data: { order: OrderDto; payment: OrderPaymentDto; action: OrderItemAction };
};

export type OrderServiceSocketEvent = {
  data: { order: OrderDto; service: OrderServiceDto; action: OrderItemAction };
};

export type OrderProductSocketEvent = {
  data: { order: OrderDto; product: OrderProductDto; action: OrderItemAction };
};

export type OrderCommentSocketEvent = {
  data: { comment: OrderCommentDto };
};

export type OrderDocumentSocketEvent = {
  data: { document: DocumentDto };
};

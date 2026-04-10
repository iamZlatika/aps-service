import type { z } from "zod";

import type { Customer } from "@/features/backoffice/modules/customers/types.ts";
import type { newOrderSchema } from "@/features/backoffice/modules/orders/lib/schema.ts";
import type { User } from "@/features/backoffice/modules/users/types.ts";

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
  prepayment: string | null;
  dueDate: string;
  estimatedCost: string | null;
  isUrgent: boolean;
  isCalled: boolean;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  // statusHistory: StatusHistoryItem[];
  // items: unknown[];
};

export type NewOrder = z.infer<typeof newOrderSchema>;

import { type Location } from "@/entities/location/types";
import { type OrderStatus } from "@/entities/order-status/types";
import type { TrackPayment } from "@/features/website/types";
import { type DocumentType } from "@/shared/types";

export type OrderListItem = {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  deviceType: string;
  manufacturer: string;
  deviceModel: string;
  isUrgent: boolean;
  estimatedCost: string | null;
  totalPaid: string;
  remainingToPay: string;
  dueDate: string;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderDocument = {
  id: number;
  type: DocumentType;
  name: string;
  createdAt: string;
  downloadUrl: string;
};

export type OrderLineItem = {
  name: string;
  quantity: number;
  price: string;
  sum: string;
};

export type OrderDetail = OrderListItem & {
  issueType: string;
  deviceCondition: string | null;
  accessory: string | null;
  intakeNote: string | null;
  location: Location;
  payments: TrackPayment[];
  services: OrderLineItem[];
  products: OrderLineItem[];
  documents: OrderDocument[];
};

export type OrdersListMeta = {
  currentPage: number;
  lastPage: number;
  total: number;
};

export type OrdersListResult = {
  items: OrderListItem[];
  meta: OrdersListMeta;
};

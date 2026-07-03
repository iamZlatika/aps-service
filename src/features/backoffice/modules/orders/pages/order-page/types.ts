import {
  type OrderItem,
  type OrderStatus,
} from "@/features/backoffice/modules/orders/types.ts";
import { type User } from "@/features/backoffice/modules/users/types.ts";
import { type PaymentType } from "@/shared/types.ts";

export type ModalState =
  | { mode: "add"; type: "product" | "service" }
  | { mode: "edit"; item: OrderItem; readOnly?: boolean }
  | null;

export type HistoryStatus = {
  type: "status";
  id: number;
  date: string;
  user: User;
  status: OrderStatus;
};
export type HistoryService = {
  type: "service";
  id: number;
  date: string;
  user: User;
  name: string;
  price: number;
  costPrice: number;
  quantity: number;
  event: "added" | "deleted";
};

export type HistoryProduct = {
  type: "product";
  id: number;
  date: string;
  user: User;
  name: string;
  price: number;
  purchasePrice: number;
  quantity: number;
  event: "added" | "deleted";
};

export type HistoryComment = {
  type: "comment";
  id: number;
  date: string;
  user: User;
  text?: string;
  image?: string;
};

export type HistoryPayment = {
  type: "payment";
  id: number;
  date: string;
  user: User;
  paymentType: PaymentType;
  amount: number;
  note?: string;
  event: "added" | "deleted";
};
export type HistoryCall = {
  type: "call";
  id: number;
  date: string;
  user: User | null;
  isCalled: boolean;
};

export type HistorySms = {
  type: "sms";
  date: string;
};

export type OrderHistoryItem =
  | HistoryStatus
  | HistoryService
  | HistoryProduct
  | HistoryComment
  | HistoryPayment
  | HistoryCall
  | HistorySms;

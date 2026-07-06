import { type OrderStatus } from "@/entities/order-status/types";
import { type PaymentMethodType, type PaymentType } from "@/shared/types";

export type { DaySlot, Location, Schedule } from "@/entities/location/types";
export type { OrderStatus } from "@/entities/order-status/types";
export type { WeekDay } from "@/shared/types";
export { WEEK_DAYS } from "@/shared/types";

// --- Track domain types (mapped from server response) ---

export type TrackStatusHistoryItem = {
  status: OrderStatus;
  createdAt: string;
};

export type TrackProduct = {
  name: string;
  price: string;
  sum: string;
  quantity: number;
  createdAt: string;
  completedAt: string | null;
  deletedAt: string | null;
};

export type TrackService = {
  name: string;
  price: string;
  sum: string;
  quantity: number;
  createdAt: string;
  completedAt: string | null;
  deletedAt: string | null;
};

export type TrackPayment = {
  type: PaymentType;
  method: PaymentMethodType;
  amount: string;
  createdAt: string;
};

export type Track = {
  orderNumber: string;
  status: OrderStatus;
  deviceType: string;
  manufacturer: string;
  deviceModel: string;
  deviceCondition: string | null;
  accessory: string | null;
  issueType: string;
  estimatedCost: string | null;
  totalPaid: string;
  dueDate: string;
  isCalled: boolean;
  isUrgent: boolean;
  createdAt: string;
  statusHistory: TrackStatusHistoryItem[];
  products: TrackProduct[];
  services: TrackService[];
  payments: TrackPayment[];
};

export type OrderPreview = Pick<
  Track,
  | "orderNumber"
  | "status"
  | "manufacturer"
  | "deviceType"
  | "deviceModel"
  | "issueType"
>;

// --- Reviews ---

export type Review = {
  id: string;
  authorName: string;
  authorPhotoUrl: string;
  rating: number;
  text: string;
  publishedAt: string;
};

// --- Price list ---

export type {
  PriceListCategory,
  PriceListItem,
} from "@/entities/price-list/types";

// --- Landing ---

export type CategoryMinPrice = {
  categoryKey: string;
  categoryNameRu: string;
  categoryNameUk: string;
  minPrice: number;
};

export type LandingData = {
  activeCount: number;
  prices: CategoryMinPrice[];
};

// --- OrderHistory types (UI layer, used by OrderHistoryAccordion) ---

export type OrderHistoryStatus = {
  type: "status";
  id: string;
  date: string;
  status: OrderStatus;
};

export type OrderHistoryPayment = {
  type: "payment";
  id: string;
  date: string;
  paymentType: PaymentType;
  method: PaymentMethodType;
  amount: number;
};

export type OrderHistoryProduct = {
  type: "product";
  id: string;
  date: string;
  name: string;
  price: number;
  quantity: number;
  sum: number;
  event: "added" | "deleted";
};

export type OrderHistoryService = {
  type: "service";
  id: string;
  date: string;
  name: string;
  price: number;
  quantity: number;
  sum: number;
  event: "added" | "deleted";
};

export type OrderHistoryItem =
  | OrderHistoryStatus
  | OrderHistoryPayment
  | OrderHistoryProduct
  | OrderHistoryService;

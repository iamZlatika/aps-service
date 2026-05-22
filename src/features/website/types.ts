import { type OrderStatus } from "@/shared/types";

export type { OrderStatus };
export type {
  DaySlot,
  Location,
  Schedule,
  WEEK_DAYS,
  WeekDay,
} from "@/shared/types";

export type TrackStatusHistoryItem = {
  status: OrderStatus;
  createdAt: string;
};

export type OrderPreview = Pick<
  Track,
  | "orderNumber"
  | "status"
  | "manufacturer"
  | "deviceType"
  | "deviceModel"
  | "issueType"
  | "statusHistory"
>;

export type Track = {
  orderNumber: string;
  status: OrderStatus;
  deviceType: string;
  manufacturer: string;
  deviceModel: string;
  deviceCondition: string | null;
  accessory: string | null;
  issueType: string;
  intakeNote: string | null;
  estimatedCost: string | null;
  totalPaid: string;
  dueDate: string;
  isCalled: boolean;
  isUrgent: boolean;
  createdAt: string;
  statusHistory: TrackStatusHistoryItem[];
};

import { type BaseItem } from "@/features/backoffice/widgets/table/models/types.ts";
import { type STATUS_COLORS } from "@/shared/types.ts";

export type DictionaryItem = {
  id: number;
  name: string;
};

export type PaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number | null;
  to: number | null;
};

export type PaginatedDictionaryItems<T extends BaseItem = DictionaryItem> = {
  items: T[];
  meta: PaginationMeta;
};

export type StatusColor = (typeof STATUS_COLORS)[keyof typeof STATUS_COLORS];

export const WEEK_DAYS = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;
export type WeekDay = (typeof WEEK_DAYS)[number];

export type ScheduleDay = { from: string; to: string } | null;
export type LocationSchedule = Record<WeekDay, ScheduleDay>;

export type Location = {
  id: number;
  name: string;
  address: string;
  phone: string;
  schedule: LocationSchedule | null;
  scheduleDisplay: string | null;
};

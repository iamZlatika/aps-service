import { type BaseItem } from "@/features/backoffice/widgets/table/models/types.ts";
import { type WeekDay } from "@/shared/types";
import { type STATUS_COLORS } from "@/shared/types.ts";

export type { Location } from "@/shared/types";

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

export type ScheduleGroup = {
  fromDay: WeekDay;
  toDay: WeekDay;
  from: string;
  to: string;
};

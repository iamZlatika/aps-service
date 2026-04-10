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

export type Location = {
  id: number;
  name: string;
  address: string;
  phone: string;
};

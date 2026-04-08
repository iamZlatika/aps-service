import { type BaseItem } from "@/features/backoffice/widgets/table/models/types.ts";

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

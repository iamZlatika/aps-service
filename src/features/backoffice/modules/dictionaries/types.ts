import { type BaseItem } from "@/features/backoffice/widgets/table/models/types.ts";

export type PaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number | null;
  to: number | null;
};

export type PaginatedDictionaryItems = {
  items: BaseItem[];
  meta: PaginationMeta;
};

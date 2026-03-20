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

export type PaginatedDictionaryItems = {
  items: DictionaryItem[];
  meta: PaginationMeta;
};

import type { SortType } from "@/shared/components/table/hooks/useSortParams.ts";

export interface PaginatedResponse<T extends BaseItem = BaseItem> {
  items: T[];
  meta: {
    currentPage: number;
    lastPage: number;
    total: number;
  };
}

export interface SmartTableApi<T extends BaseItem = BaseItem> {
  getAll: (
    page: number,
    perPage: number,
    sortColumn?: string | null,
    sortType?: SortType,
  ) => Promise<PaginatedResponse<T>>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: number, data: Partial<T>) => Promise<T>;
  remove: (id: number) => Promise<void>;
}

export type ColumnConfig = {
  key: string;
  labelKey: string;
  sortable: boolean;
  className?: string;
  required?: boolean;
};

export type BaseItem = {
  id: number;
  [key: string]: string | number;
};

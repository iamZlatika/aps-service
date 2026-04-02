import { type ReactNode } from "react";

import type { SortType } from "@/features/backoffice/widgets/table/hooks/useSortParams.ts";

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
    filters?: Record<string, string>,
  ) => Promise<PaginatedResponse<T>>;
}

export type SelectOption = {
  value: string;
  label: string;
};

export interface FieldConfig {
  key: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: "input" | "select" | "phone";
  inputType?: string;
  options?: SelectOption[];
}
export type ColumnConfig<
  T extends BaseItem,
  K extends keyof T & string = keyof T & string,
> = {
  key: K;
  labelKey: string;
  sortable: boolean;
  className?: string;
  required?: boolean;
  type?: "input" | "select" | "phone";
  options?: { value: string; label: string }[];
  renderCell?: (value: T[K], item: T) => ReactNode;
  filterable?: boolean;
  filterType?: "text" | "select" | "range";
};

export type BaseItem = {
  id: number;
  [key: string]: unknown;
};

export type Filters = Record<string, string>;

export type RenderRowActions<T extends BaseItem = BaseItem> = (
  item: T,
) => ReactNode;

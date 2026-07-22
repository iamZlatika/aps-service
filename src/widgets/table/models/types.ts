import { type ReactNode } from "react";

import type { SortType } from "@/widgets/table/hooks/useSortParams.ts";

export type PaginatedResponse<T extends BaseItem = BaseItem> = {
  items: T[];
  meta: {
    currentPage: number;
    lastPage: number;
    total: number;
  };
};

export type SmartTableApi<T extends BaseItem = BaseItem> = {
  getAll: (
    page: number,
    perPage: number,
    sortColumn?: string | null,
    sortType?: SortType,
    filters?: Record<string, string>,
  ) => Promise<PaginatedResponse<T>>;
};

export type SelectOption = {
  value: string;
  label: string;
  colorDot?: string;
};

export type FieldConfig = {
  key: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: "input" | "select" | "phone" | "card" | "url";
  inputType?: string;
  options?: SelectOption[];
  getInitialValue?: (item: Record<string, unknown>) => unknown;
};
export type ColumnConfig<
  T extends BaseItem,
  K extends keyof T & string = keyof T & string,
> = {
  key: string;
  field: K;
  labelKey: string;
  placeholderKey?: string;
  sortable: boolean;
  sortKey?: string;
  className?: string;
  required?: boolean;
  type?: "input" | "select" | "phone" | "card" | "url";
  options?: { value: string; label: string }[];
  renderCell?: (value: T[K], item: T) => ReactNode;
  filterable?: boolean;
  filterType?: "text" | "select" | "range";
  formField?: boolean;
};

export type BaseItem = {
  id: number;
};

export type Filters = Record<string, string>;

export type RenderRowActions<T extends BaseItem = BaseItem> = (
  item: T,
) => ReactNode;

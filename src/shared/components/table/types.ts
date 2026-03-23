export type ColumnConfig = {
  key: string;
  labelKey: string;
  sortable: boolean;
  className?: string;
};

export type BaseItem = {
  id: number;
  [key: string]: string | number;
};

import type {
  BaseItem,
  ColumnConfig,
} from "@/features/backoffice/widgets/table/models/types.ts";

export const resolveDisplayValue = <
  T extends BaseItem,
  K extends keyof T & string,
>(
  col: ColumnConfig<T, K>,
  value: T[K],
): string | number => {
  if (col.type === "select" && col.options) {
    const found = col.options.find((opt) => opt.value === String(value));
    return found ? found.label : String(value);
  }

  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  return "";
};

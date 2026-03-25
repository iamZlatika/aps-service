import type { ColumnConfig } from "@/shared/components/table/models/types.ts";

export const resolveDisplayValue = (
  col: ColumnConfig,
  value: string | number,
): string | number => {
  if (col.type === "select" && col.options) {
    const found = col.options.find((opt) => opt.value === String(value));
    return found ? found.label : value;
  }
  return value;
};

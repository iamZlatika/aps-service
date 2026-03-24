import type {
  ColumnConfig,
  FieldConfig,
} from "@/shared/components/table/types.ts";

export const toFieldConfigs = (
  columns: ColumnConfig[],
  t: (key: string) => string,
): FieldConfig[] =>
  columns.map((col) => ({
    key: col.key,
    label: t(col.labelKey),
    placeholder: t(col.labelKey),
    required: col.required !== false,
    type: col.type ?? "input",
    options: col.options,
  }));

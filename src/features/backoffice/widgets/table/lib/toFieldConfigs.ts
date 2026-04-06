import type {
  BaseItem,
  ColumnConfig,
  FieldConfig,
} from "@/features/backoffice/widgets/table/models/types.ts";

export const toFieldConfigs = <T extends BaseItem>(
  columns: ColumnConfig<T>[],
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

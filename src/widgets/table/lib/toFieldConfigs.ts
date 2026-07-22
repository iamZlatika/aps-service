import type {
  BaseItem,
  ColumnConfig,
  FieldConfig,
} from "@/widgets/table/models/types.ts";

export const toFieldConfigs = <T extends BaseItem>(
  columns: ColumnConfig<T>[],
  t: (key: string) => string,
): FieldConfig[] =>
  columns
    .filter((col) => col.formField !== false)
    .map((col) => ({
      key: col.field,
      label: t(col.labelKey),
      placeholder: t(col.placeholderKey ?? col.labelKey),
      required: col.required !== false,
      type: col.type ?? "input",
      options: col.options,
    }));

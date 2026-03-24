import type { SelectOption } from "@/shared/components/table/types.ts";

const REPAIR_CATEGORY_KEYS = [
  "cleaning",
  "diagnostics",
  "repair",
  "replacement",
  "restoration",
  "settings_update_reflashing",
] as const;

export const getRepairCategoryOptions = (
  t: (key: string) => string,
): SelectOption[] =>
  REPAIR_CATEGORY_KEYS.map((key) => ({
    value: key,
    label: t(`pages.repair_operations.options.${key}`),
  }));

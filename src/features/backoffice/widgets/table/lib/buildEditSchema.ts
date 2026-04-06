import { z } from "zod";

import { type FieldConfig } from "@/features/backoffice/widgets/table/models/types.ts";

export const buildEditSchema = (
  fields: FieldConfig[],
  t: (key: string) => string,
) => {
  const shape: Record<string, z.ZodString> = {};

  for (const field of fields) {
    let fieldSchema = z.string().trim();

    if (field.required) {
      fieldSchema = fieldSchema.min(1, t("validation.field_required"));
    }

    shape[field.key] = fieldSchema;
  }

  return z.object(shape);
};

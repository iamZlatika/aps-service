import { z } from "zod";

import { type FieldConfig } from "@/widgets/table/models/types.ts";

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const buildEditSchema = (
  fields: FieldConfig[],
  t: (key: string) => string,
) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let fieldSchema = z.string().trim();

    if (field.required) {
      fieldSchema = fieldSchema.min(1, t("validation.field_required"));
    }

    if (field.type === "url") {
      shape[field.key] = fieldSchema.refine(
        (value) => value === "" || isValidHttpUrl(value),
        t("validation.url_invalid"),
      );
      continue;
    }

    shape[field.key] = fieldSchema;
  }

  return z.object(shape);
};

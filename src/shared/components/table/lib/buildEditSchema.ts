import i18next from "i18next";
import { z } from "zod";

import type { FieldConfig } from "@/shared/components/table/dialogs/EditItemDialog";

export const buildEditSchema = (fields: FieldConfig[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let fieldSchema = z.string().trim();

    if (field.required) {
      fieldSchema = fieldSchema.min(1, i18next.t("validation.field_required"));
    }

    shape[field.key] = fieldSchema;
  }

  return z.object(shape);
};

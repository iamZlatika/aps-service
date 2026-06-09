import i18next from "i18next";
import { z } from "zod";

export const workEditSchema = z.object({
  device_type: z.string().min(1, i18next.t("validation.field_required")),
  manufacturer: z.string().min(1, i18next.t("validation.field_required")),
  device_model: z.string().min(1, i18next.t("validation.field_required")),
  description_ru: z.string().min(1, i18next.t("validation.field_required")),
  description_uk: z.string().min(1, i18next.t("validation.field_required")),
  reason_ru: z.string().optional(),
  reason_uk: z.string().optional(),
});

export type WorkEditFormValues = z.infer<typeof workEditSchema>;

import i18next from "i18next";
import { z } from "zod";

export const newOrderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(1, i18next.t("validation.field_required")),
  customerPhone: z
    .string()
    .regex(/^\+380\d{9}$/, i18next.t("validation.phone_invalid")),
  issueType: z.string().trim().min(1, i18next.t("validation.field_required")),
  deviceType: z.string().trim().min(1, i18next.t("validation.field_required")),
  manufacturer: z
    .string()
    .trim()
    .min(1, i18next.t("validation.field_required")),
  deviceModel: z.string().trim().min(1, i18next.t("validation.field_required")),
});

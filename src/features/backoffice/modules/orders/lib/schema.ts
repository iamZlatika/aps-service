import i18next from "i18next";
import { z } from "zod";

import { emailRegex } from "@/shared/lib/constants.ts";

export const newOrderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(1, i18next.t("validation.field_required")),
  customerPhone: z
    .string()
    .regex(/^\+380\d{9}$/, i18next.t("validation.phone_invalid")),
  customerEmail: z
    .string()
    .optional()
    .refine((val) => !val || emailRegex.test(val), {
      message: i18next.t("validation.email_invalid"),
    }),
  customerComment: z.string().optional(),
  managerId: z.number().int().positive().optional(),
  assigneeId: z.number().int().positive().optional(),
  prepayment: z.string().optional(),

  issueType: z.string().trim().min(1, i18next.t("validation.field_required")),
  deviceType: z.string().trim().min(1, i18next.t("validation.field_required")),
  manufacturer: z
    .string()
    .trim()
    .min(1, i18next.t("validation.field_required")),
  deviceModel: z.string().trim().min(1, i18next.t("validation.field_required")),
  devicePassword: z.string().min(1, i18next.t("validation.field_required")),
  deviceCondition: z.string().optional(),
  accessory: z.string().optional(),
  intakeNote: z.string().optional(),
  isUrgent: z.boolean().optional(),
  estimatedCost: z.string().optional(),
});

export type NewOrderSchema = z.infer<typeof newOrderSchema>;

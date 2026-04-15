import i18next from "i18next";
import { z } from "zod";

import { emailRegex } from "@/shared/lib/constants.ts";

export const newOrderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(1, i18next.t("validation.field_required")),
  customerPrimaryPhone: z
    .string()
    .regex(/^\+380\d{9}$/, i18next.t("validation.phone_invalid")),
  customerSecondaryPhone: z
    .string()
    .regex(/^\+380\d{9}$/, i18next.t("validation.phone_invalid"))
    .optional(),
  customerEmail: z
    .string()
    .optional()
    .refine((val) => !val || emailRegex.test(val), {
      message: i18next.t("validation.email_invalid"),
    }),
  customerComment: z.string().optional(),
  managerId: z.number().int().positive(),
  assigneeId: z.number().int().positive().optional(),
  locationId: z.number().int().positive(),
  prepayment: z.string().optional(),
  isUrgent: z.boolean().optional(),
  issueType: z.string().trim().min(1, i18next.t("validation.field_required")),
  deviceType: z.string().trim().min(1, i18next.t("validation.field_required")),
  manufacturer: z
    .string()
    .trim()
    .min(1, i18next.t("validation.field_required")),
  deviceModel: z.string().trim().min(1, i18next.t("validation.field_required")),
  deviceCondition: z.array(z.string()).optional(),
  accessory: z.array(z.string()).optional(),
  intakeNote: z.string().optional(),
  devicePassword: z.string().min(1, i18next.t("validation.field_required")),
  estimatedCost: z.string().optional(),
});

export type NewOrderSchema = z.infer<typeof newOrderSchema>;

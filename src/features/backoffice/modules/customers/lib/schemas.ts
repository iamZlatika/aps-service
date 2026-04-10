import i18next from "i18next";
import { z } from "zod";

import { emailRegex } from "@/shared/lib/constants.ts";

export const newCustomerSchema = z.object({
  name: z.string().trim().min(1, i18next.t("validation.field_required")),
  phone: z
    .string()
    .regex(/^\+380\d{9}$/, i18next.t("validation.phone_invalid")),
  email: z
    .string()
    .trim()
    .refine((val) => val === "" || emailRegex.test(val), {
      message: i18next.t("validation.email_invalid"),
    })
    .optional()
    .transform((val) => val ?? null),
  comment: z
    .string()
    .optional()
    .transform((val) => val ?? null),
});

export const addPhoneSchema = z.object({
  phone: z
    .string()
    .regex(/^\+380\d{9}$/, i18next.t("validation.phone_invalid")),
});

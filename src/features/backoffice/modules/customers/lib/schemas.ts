import i18next from "i18next";
import { z } from "zod";

import { emailRegex } from "@/shared/lib/constants.ts";
import { phoneField } from "@/shared/lib/zod-helpers.ts";

export const editCustomerInfoSchema = z.object({
  name: z.string().trim().min(1, i18next.t("validation.field_required")),
  email: z
    .string()
    .trim()
    .refine((val) => val === "" || emailRegex.test(val), {
      message: i18next.t("validation.email_invalid"),
    }),
  comment: z.string(),
});

export type EditCustomerInfoFormValues = z.infer<typeof editCustomerInfoSchema>;

export const newCustomerSchema = z.object({
  name: z.string().trim().min(1, i18next.t("validation.field_required")),
  phone: phoneField(),
  secondaryPhone: phoneField().optional(),
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
  phone: phoneField(),
});

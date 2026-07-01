import i18next from "i18next";
import { z } from "zod";

import { emailRegex } from "@/shared/lib/constants.ts";

const registerUserFieldsBaseSchema = z.object({
  email: z.string().refine((val) => emailRegex.test(val), {
    message: i18next.t("validation.email_invalid"),
  }),
  name: z.string().trim().min(1, i18next.t("validation.field_required")),
  password: z.string().min(8, i18next.t("validation.password_min")),
  password_confirmation: z
    .string()
    .min(1, i18next.t("validation.field_required")),
});

function passwordsMatch(data: {
  password: string;
  password_confirmation: string;
}): boolean {
  return data.password === data.password_confirmation;
}

const PASSWORD_MISMATCH_REFINEMENT: { message: string; path: string[] } = {
  message: i18next.t("validation.passwords_dont_match"),
  path: ["password_confirmation"],
};

export const registerUserFieldsSchema = registerUserFieldsBaseSchema.refine(
  passwordsMatch,
  PASSWORD_MISMATCH_REFINEMENT,
);

export const registerUserSchema = registerUserFieldsBaseSchema
  .extend({
    roles: z.array(z.string()).min(1, i18next.t("validation.field_required")),
    permissions: z.array(z.string()).default([]),
  })
  .refine(passwordsMatch, PASSWORD_MISMATCH_REFINEMENT);

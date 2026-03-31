import i18next from "i18next";
import { z } from "zod";

import { emailRegex } from "@/shared/lib/constants.ts";

export const registerUserSchema = z
  .object({
    email: z.string().refine((val) => emailRegex.test(val), {
      message: i18next.t("validation.email_invalid"),
    }),
    name: z.string().trim().min(1, i18next.t("validation.field_required")),
    password: z.string().min(8, i18next.t("validation.password_min")),
    password_confirmation: z
      .string()
      .min(1, i18next.t("validation.field_required")),
    role: z.string().min(1, i18next.t("validation.field_required")),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: i18next.t("validation.passwords_dont_match"),
    path: ["password_confirmation"],
  });

import i18next from "i18next";
import * as z from "zod";

import { emailRegex } from "@/shared/lib/constants.ts";

export const forgotSchema = z.object({
  email: z.string().refine((val) => emailRegex.test(val), {
    message: i18next.t("validation.email_invalid"),
  }),
});

export type ForgotFormValues = z.infer<typeof forgotSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: i18next.t("validation.password_min") })
      .max(255, { message: i18next.t("validation.password_max") }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: i18next.t("validation.passwords_dont_match"),
    path: ["password_confirmation"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

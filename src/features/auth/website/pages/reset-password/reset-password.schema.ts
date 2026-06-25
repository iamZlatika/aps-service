import i18next from "i18next";
import { z } from "zod";

export const createResetPasswordSchema = () =>
  z
    .object({
      password: z
        .string()
        .min(8, { message: i18next.t("validation.password_min") })
        .max(255, { message: i18next.t("validation.password_max") }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: i18next.t("validation.passwords_dont_match"),
      path: ["confirmPassword"],
    });

export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;

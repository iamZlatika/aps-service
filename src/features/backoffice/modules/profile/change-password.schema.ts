import i18next from "i18next";
import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, i18next.t("profile.change_form.too_short")),

    newPassword: z.string().min(8, i18next.t("profile.change_form.too_short")),

    confirmPassword: z
      .string()
      .min(8, i18next.t("profile.change_form.too_short")),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: i18next.t("profile.change_form.passwords_not_match"),
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

import i18next from "i18next";
import { z } from "zod";

import { emailRegex } from "@/shared/lib/constants.ts";

export const createProfileSchema = () =>
  z
    .object({
      currentPassword: z
        .string()
        .min(8, i18next.t("profile.change_form.too_short")),
      newPassword: z
        .string()
        .min(8, i18next.t("profile.change_form.too_short")),
      confirmPassword: z
        .string()
        .min(8, i18next.t("profile.change_form.too_short")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: i18next.t("profile.change_form.passwords_dont_match"),
      path: ["confirmPassword"],
    });

export const createChangeUserInfoSchema = () =>
  z.object({
    name: z.string().min(3, i18next.t("profile.user_info.name_too_short")),
    email: z.string().refine((val) => emailRegex.test(val), {
      message: i18next.t("validation.email_invalid"),
    }),
  });

export type ChangePasswordFormValues = z.infer<
  ReturnType<typeof createProfileSchema>
>;
export type ChangeUserInfoFormValues = z.infer<
  ReturnType<typeof createChangeUserInfoSchema>
>;

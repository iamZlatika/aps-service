import i18next from "i18next";
import { z } from "zod";

import { emailRegex } from "@/shared/lib/constants";

const ALLOWED_AVATAR_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const avatarFileSchema = z
  .instanceof(File)
  .refine((file) => ALLOWED_AVATAR_MIME_TYPES.includes(file.type), {
    message: i18next.t("validation.image_type"),
  });

export const createProfileNameSchema = () =>
  z.object({
    portalName: z.string().min(1, i18next.t("validation.field_required")),
  });

export const createChangePasswordSchema = () =>
  z
    .object({
      currentPassword: z.string().min(8, i18next.t("validation.password_min")),
      newPassword: z.string().min(8, i18next.t("validation.password_min")),
      confirmPassword: z.string().min(8, i18next.t("validation.password_min")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: i18next.t("validation.passwords_dont_match"),
      path: ["confirmPassword"],
    });

export const createChangeEmailSchema = () =>
  z.object({
    newEmail: z.string().refine((val) => emailRegex.test(val), {
      message: i18next.t("validation.email_invalid"),
    }),
    currentPassword: z.string().min(8, i18next.t("validation.password_min")),
  });

export type ProfileNameFormValues = z.infer<
  ReturnType<typeof createProfileNameSchema>
>;
export type ChangePasswordFormValues = z.infer<
  ReturnType<typeof createChangePasswordSchema>
>;
export type ChangeEmailFormValues = z.infer<
  ReturnType<typeof createChangeEmailSchema>
>;

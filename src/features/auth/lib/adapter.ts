import { type ChangePasswordData } from "@/features/auth/types.ts";
import { type ChangePasswordFormValues } from "@/features/backoffice/modules/profile/change-password.schema.ts";

export const mapChangePasswordToApi = (
  data: ChangePasswordFormValues,
): ChangePasswordData => ({
  current_password: data.currentPassword,
  password: data.newPassword,
  password_confirmation: data.confirmPassword,
});

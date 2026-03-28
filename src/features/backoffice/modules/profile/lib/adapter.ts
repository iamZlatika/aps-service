import { type ChangePasswordFormValues } from "@/features/backoffice/modules/profile/profile.schema.ts";

export interface ChangePasswordRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export const mapChangePasswordToApi = (
  data: ChangePasswordFormValues,
): ChangePasswordRequest => ({
  current_password: data.currentPassword,
  password: data.newPassword,
  password_confirmation: data.confirmPassword,
});

import {
  type ChangeEmailFormValues,
  type ChangePasswordFormValues,
  type ProfileNameFormValues,
} from "@/features/website/modules/profile/profile.schema";

export interface UpdateProfileNameRequestBody {
  portal_name: string;
}

export interface ChangePasswordRequestBody {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ChangeEmailRequestBody {
  new_email: string;
  current_password: string;
}

export function mapProfileNameToRequestBody(
  values: ProfileNameFormValues,
): UpdateProfileNameRequestBody {
  return { portal_name: values.portalName };
}

export function mapChangePasswordToRequestBody(
  values: ChangePasswordFormValues,
): ChangePasswordRequestBody {
  return {
    current_password: values.currentPassword,
    password: values.newPassword,
    password_confirmation: values.confirmPassword,
  };
}

export function mapChangeEmailToRequestBody(
  values: ChangeEmailFormValues,
): ChangeEmailRequestBody {
  return {
    new_email: values.newEmail,
    current_password: values.currentPassword,
  };
}

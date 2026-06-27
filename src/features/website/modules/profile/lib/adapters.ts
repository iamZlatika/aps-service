import type { TelegramLinkDto } from "@/features/website/modules/profile/api/dto";
import {
  type ChangeEmailFormValues,
  type ChangePasswordFormValues,
  type ProfileNameFormValues,
} from "@/features/website/modules/profile/profile.schema";
import type { TelegramLink } from "@/features/website/modules/profile/types";

export type UpdateProfileNameRequestBody = {
  portal_name: string;
};

export type ChangePasswordRequestBody = {
  current_password: string;
  password: string;
  password_confirmation: string;
};

export type ChangeEmailRequestBody = {
  new_email: string;
  current_password: string;
};

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

export function mapTelegramLinkDtoToTelegramLink(
  dto: TelegramLinkDto,
): TelegramLink {
  return {
    link: dto.link,
    qrCode: dto.qr_code,
  };
}

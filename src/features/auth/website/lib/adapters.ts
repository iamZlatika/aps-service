import {
  type AuthResponseDto,
  type CustomerDto,
  type CustomerPhoneDto,
  type RegistrationResponseDto,
} from "@/features/auth/website/api/dto";
import { type ResetPasswordFormValues } from "@/features/auth/website/pages/reset-password/reset-password.schema";
import {
  type AuthResponse,
  type Customer,
  type CustomerPhone,
  type RegistrationResponse,
  type ResetPasswordData,
} from "@/features/auth/website/types";

export function mapCustomerPhoneDtoToCustomerPhone(
  dto: CustomerPhoneDto,
): CustomerPhone {
  return {
    id: dto.id,
    phoneNumber: dto.phone_number,
    phoneVerifiedAt: dto.phone_verified_at,
    isPrimary: dto.is_primary,
  };
}

export function mapCustomerDtoToCustomer(dto: CustomerDto): Customer {
  return {
    id: dto.id,
    portalName: dto.portal_name,
    email: dto.email,
    pendingEmail: dto.pending_email,
    emailVerifiedAt: dto.email_verified_at,
    hasGoogle: dto.has_google,
    avatarUrl: dto.avatar_url,
    phones: dto.phones.map(mapCustomerPhoneDtoToCustomerPhone),
    status: dto.status,
    lastOrderAt: dto.last_order_at,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapAuthResponseDtoToAuthResponse(
  dto: AuthResponseDto,
): AuthResponse {
  return {
    token: dto.token,
    customer: mapCustomerDtoToCustomer(dto.customer),
  };
}

export function mapRegistrationResponseDtoToRegistrationResponse(
  dto: RegistrationResponseDto,
): RegistrationResponse {
  return {
    email: dto.email,
  };
}

export function mapResetPasswordValuesToRequestBody(
  values: ResetPasswordFormValues,
): Pick<ResetPasswordData, "password" | "password_confirmation"> {
  return {
    password: values.password,
    password_confirmation: values.confirmPassword,
  };
}

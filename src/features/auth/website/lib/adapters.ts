import {
  type AuthResponseDto,
  type ClientUserDto,
  type RegistrationResponseDto,
} from "@/features/auth/website/api/dto";
import {
  type AuthResponse,
  type ClientUser,
  type RegistrationResponse,
} from "@/features/auth/website/types";

export function mapClientUserDtoToClientUser(dto: ClientUserDto): ClientUser {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    phone: dto.phone,
    role: dto.role,
  };
}

export function mapAuthResponseDtoToAuthResponse(
  dto: AuthResponseDto,
): AuthResponse {
  return {
    token: dto.token,
    user: mapClientUserDtoToClientUser(dto.user),
  };
}

export function mapRegistrationResponseDtoToRegistrationResponse(
  dto: RegistrationResponseDto,
): RegistrationResponse {
  return {
    emailVerified: dto.email_verified,
  };
}

import {
  AuthResponseDtoSchema,
  type LoginRequestBody,
  type RegistrationRequestBody,
  RegistrationResponseDtoSchema,
} from "@/features/auth/website/api/dto";
import { WEBSITE_AUTH_API } from "@/features/auth/website/api/endpoints";
import {
  mapAuthResponseDtoToAuthResponse,
  mapRegistrationResponseDtoToRegistrationResponse,
} from "@/features/auth/website/lib/adapters";
import {
  type AuthResponse,
  type RegistrationResponse,
} from "@/features/auth/website/types";
import { get, post } from "@/shared/api/api";
import { parseDto } from "@/shared/api/parseDto";

export const websiteAuthApi = {
  register: async (
    body: RegistrationRequestBody,
  ): Promise<RegistrationResponse> => {
    const response = await post<RegistrationRequestBody, unknown>(
      WEBSITE_AUTH_API.register(),
      body,
    );
    const validated = parseDto(RegistrationResponseDtoSchema, response);
    return mapRegistrationResponseDtoToRegistrationResponse(validated);
  },
  emailResend: async (email: string): Promise<void> => {
    await post(WEBSITE_AUTH_API.emailResend(), { email });
  },
  emailVerify: async (verifyUrl: string): Promise<void> => {
    await get(verifyUrl);
  },
  login: async (body: LoginRequestBody): Promise<AuthResponse> => {
    const response = await post<LoginRequestBody, unknown>(
      WEBSITE_AUTH_API.login(),
      body,
    );
    const validated = parseDto(AuthResponseDtoSchema, response);
    return mapAuthResponseDtoToAuthResponse(validated);
  },
};

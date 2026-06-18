import {
  AuthResponseDtoSchema,
  type LoginRequestBody,
  MeResponseDtoSchema,
  type RegistrationRequestBody,
  RegistrationResponseDtoSchema,
  type SendPhoneCodeRequestBody,
  type VerifyPhoneCodeRequestBody,
} from "@/features/auth/website/api/dto";
import { WEBSITE_AUTH_API } from "@/features/auth/website/api/endpoints";
import {
  mapAuthResponseDtoToAuthResponse,
  mapCustomerDtoToCustomer,
  mapRegistrationResponseDtoToRegistrationResponse,
} from "@/features/auth/website/lib/adapters";
import {
  type AuthResponse,
  type Customer,
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
  logout: async (): Promise<void> => {
    await post(WEBSITE_AUTH_API.logout());
  },
  me: async (): Promise<Customer> => {
    const response = await get(WEBSITE_AUTH_API.me());
    const validated = parseDto(MeResponseDtoSchema, response);
    return mapCustomerDtoToCustomer(validated.data);
  },
  sendPhoneCode: async (body: SendPhoneCodeRequestBody): Promise<void> => {
    await post(WEBSITE_AUTH_API.phoneSend(), body);
  },
  verifyPhoneCode: async (
    body: VerifyPhoneCodeRequestBody,
  ): Promise<Customer> => {
    const response = await post<VerifyPhoneCodeRequestBody, unknown>(
      WEBSITE_AUTH_API.phoneVerify(),
      body,
    );
    const validated = parseDto(MeResponseDtoSchema, response);
    return mapCustomerDtoToCustomer(validated.data);
  },
};

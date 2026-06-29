import {
  AuthResponseDtoSchema,
  MeResponseDtoSchema,
  RegistrationResponseDtoSchema,
  VerifyPhoneResponseDtoSchema,
} from "@/features/auth/website/api/dto";
import { WEBSITE_AUTH_API } from "@/features/auth/website/api/endpoints";
import {
  mapAuthResponseDtoToAuthResponse,
  mapCustomerDtoToCustomer,
  mapRegistrationResponseDtoToRegistrationResponse,
  mapVerifyPhoneResponseDtoToVerifyPhoneResponse,
} from "@/features/auth/website/lib/adapters";
import { type LoginFormValues } from "@/features/auth/website/pages/login/login.schema";
import {
  type AuthResponse,
  type CheckResetTokenData,
  type Customer,
  type RegistrationData,
  type RegistrationResponse,
  type ResetPasswordData,
  type SendPhoneCodeData,
  type VerifyPhoneCodeData,
  type VerifyPhoneResponse,
} from "@/features/auth/website/types";
import { get, post } from "@/shared/api/api";
import { parseDto } from "@/shared/api/parseDto";

export const websiteAuthApi = {
  register: async (body: RegistrationData): Promise<RegistrationResponse> => {
    const response = await post<RegistrationData, unknown>(
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
  emailVerifyToken: async (token: string): Promise<AuthResponse> => {
    const response = await post(WEBSITE_AUTH_API.emailVerifyToken(), { token });
    const validated = parseDto(AuthResponseDtoSchema, response);
    return mapAuthResponseDtoToAuthResponse(validated);
  },
  emailChangeVerify: async (token: string): Promise<AuthResponse> => {
    const response = await post(WEBSITE_AUTH_API.emailChangeVerify(), {
      token,
    });
    const validated = parseDto(AuthResponseDtoSchema, response);
    return mapAuthResponseDtoToAuthResponse(validated);
  },
  login: async (body: LoginFormValues): Promise<AuthResponse> => {
    const response = await post<LoginFormValues, unknown>(
      WEBSITE_AUTH_API.login(),
      body,
    );
    const validated = parseDto(AuthResponseDtoSchema, response);
    return mapAuthResponseDtoToAuthResponse(validated);
  },
  logout: (): Promise<void> => {
    return post(WEBSITE_AUTH_API.logout());
  },
  forgotPassword: async (email: string): Promise<void> => {
    await post(WEBSITE_AUTH_API.passwordForgot(), { email });
  },
  resetCheckToken: async (body: CheckResetTokenData): Promise<void> => {
    await post(WEBSITE_AUTH_API.passwordCheckToken(), body);
  },
  resetPassword: async (body: ResetPasswordData): Promise<void> => {
    await post(WEBSITE_AUTH_API.passwordReset(), body);
  },
  me: async (): Promise<Customer> => {
    const response = await get(WEBSITE_AUTH_API.me());
    const validated = parseDto(MeResponseDtoSchema, response);
    return mapCustomerDtoToCustomer(validated.data);
  },
  googleCallback: async (code: string): Promise<AuthResponse> => {
    const response = await post<{ code: string }, unknown>(
      WEBSITE_AUTH_API.googleCallback(),
      { code },
    );
    const validated = parseDto(AuthResponseDtoSchema, response);
    return mapAuthResponseDtoToAuthResponse(validated);
  },
  sendPhoneCode: async (body: SendPhoneCodeData): Promise<void> => {
    await post(WEBSITE_AUTH_API.phoneSend(), body);
  },
  verifyPhoneCode: async (
    body: VerifyPhoneCodeData,
  ): Promise<VerifyPhoneResponse> => {
    const response = await post<VerifyPhoneCodeData, unknown>(
      WEBSITE_AUTH_API.phoneVerify(),
      body,
    );
    const validated = parseDto(VerifyPhoneResponseDtoSchema, response);
    return mapVerifyPhoneResponseDtoToVerifyPhoneResponse(validated);
  },
};

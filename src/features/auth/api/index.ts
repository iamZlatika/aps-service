import { type ForgotFormValues } from "@/features/auth/backoffice/pages/forgot/forgot.schema.ts";
import {
  type ChangePasswordData,
  type CheckTokenData,
  type LoginResponse,
  type ResetPasswordData,
  type SuccessResponse,
} from "@/features/auth/types.ts";
import { post } from "@/shared/api/api.ts";

import { type LoginFormValues } from "../backoffice/pages/login/login.schema.ts";
import { AuthRoutes } from "./routes.ts";

export const authApi = {
  login: (data: LoginFormValues): Promise<LoginResponse> => {
    return post<LoginFormValues, LoginResponse>(
      AuthRoutes.backofficeLoginApi(),
      data,
    );
  },
  forgot: (data: ForgotFormValues): Promise<SuccessResponse> => {
    return post(AuthRoutes.backofficeForgotApi(), data);
  },
  resetCheckToken: (data: CheckTokenData): Promise<void> => {
    return post(AuthRoutes.backofficeResetCheckTokenApi(), data);
  },
  resetPassword: (data: ResetPasswordData): Promise<SuccessResponse> => {
    return post(AuthRoutes.backofficeResetPasswordApi(), data);
  },
  changePassword: (data: ChangePasswordData): Promise<SuccessResponse> => {
    return post(AuthRoutes.backofficeChangePasswordApi(), data);
  },
};

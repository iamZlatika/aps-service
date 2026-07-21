import { type ForgotFormValues } from "@/features/auth/pages/forgot/forgot.schema.ts";
import {
  type CheckTokenData,
  type LoginResponse,
  type ResetPasswordData,
} from "@/features/auth/types.ts";
import { post } from "@/shared/api/api.ts";
import { type SuccessResponse } from "@/shared/types.ts";

import { type LoginFormValues } from "../pages/login/login.schema.ts";
import { AuthRoutes } from "./routes.ts";

export const authApi = {
  login: (data: LoginFormValues): Promise<LoginResponse> => {
    return post<LoginFormValues, LoginResponse>(AuthRoutes.loginApi(), data);
  },
  forgot: (data: ForgotFormValues): Promise<SuccessResponse> => {
    return post(AuthRoutes.forgotPasswordApi(), data);
  },
  resetCheckToken: (data: CheckTokenData): Promise<void> => {
    return post(AuthRoutes.resetCheckTokenApi(), data);
  },
  resetPassword: (data: ResetPasswordData): Promise<SuccessResponse> => {
    return post(AuthRoutes.resetPasswordApi(), data);
  },
  logout: (): Promise<void> => {
    return post(AuthRoutes.logoutApi());
  },
};

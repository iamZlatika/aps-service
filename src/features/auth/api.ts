import { post } from "@/shared/api/apiClient";

import { AuthRoutes } from "./auth-routes";
import { type LoginFormValues } from "./backoffice/pages/login/login.schema";

export interface LoginResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const authApi = {
  login: (data: LoginFormValues): Promise<LoginResponse> => {
    return post<LoginFormValues, LoginResponse>(
      AuthRoutes.backofficeLoginApi(),
      data,
    );
  },
};

import axios, { type AxiosError } from "axios";
import i18next from "i18next";

import { router } from "@/app/router.ts";
import { backofficeAuthService } from "@/features/auth/lib/authService.ts";
import { logout } from "@/features/auth/lib/sessionManager.ts";
import { SharedRoutes } from "@/shared/api/routes.ts";
import { isSecurityBlockedResponse } from "@/shared/api/securityBlock.ts";
import { type ServerErrorResponse } from "@/shared/api/types.ts";
import { ApiError } from "@/shared/lib/errors/services.ts";
import { captureError } from "@/shared/lib/sentry.ts";

declare module "axios" {
  export interface AxiosRequestConfig {
    silentErrorStatuses?: number[];
  }
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = backofficeAuthService.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ServerErrorResponse>) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401 && backofficeAuthService.getToken()) {
      logout();
    }

    if (isSecurityBlockedResponse(status, data?.message)) {
      void router.navigate(SharedRoutes.blocked());
    }

    if (status === 503) {
      void router.navigate(SharedRoutes.maintenance());
    }

    const isNetworkError = !error.response && error.code === "ERR_NETWORK";
    const message = isNetworkError
      ? i18next.t("errors.network")
      : data?.message || error.message || i18next.t("errors.unknown");

    const apiError = new ApiError(message, status, data);

    const isSilencedStatus =
      status !== undefined &&
      (error.config?.silentErrorStatuses ?? []).includes(status);

    if (
      status !== 401 &&
      status !== 403 &&
      status !== 422 &&
      status !== 503 &&
      !isSilencedStatus
    ) {
      captureError(apiError, {
        url: error.config?.url,
        method: error.config?.method,
        status,
        isNetworkError,
      });
    }

    return Promise.reject(apiError);
  },
);

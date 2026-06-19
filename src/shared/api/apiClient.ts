import axios, { type AxiosError } from "axios";
import i18next from "i18next";

import {
  type AuthScope,
  type AuthService,
  backofficeAuthService,
  customerAuthService,
} from "@/features/auth/lib/authService.ts";
import { logout } from "@/features/auth/lib/sessionManager.ts";
import { type ServerErrorResponse } from "@/shared/api/types.ts";
import { ApiError } from "@/shared/lib/errors/services.ts";
import { captureError } from "@/shared/lib/sentry.ts";

const getRequestAuthScope = (url?: string): AuthScope =>
  url?.startsWith("/backoffice") ? "backoffice" : "customer";

const getAuthServiceForScope = (scope: AuthScope): AuthService =>
  scope === "backoffice" ? backofficeAuthService : customerAuthService;

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
    const scope = getRequestAuthScope(config.url);
    const token = getAuthServiceForScope(scope).getToken();
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

    if (status === 401) {
      const scope = getRequestAuthScope(error.config?.url);
      if (getAuthServiceForScope(scope).getToken()) {
        logout(scope);
      }
    }

    const isNetworkError = !error.response && error.code === "ERR_NETWORK";
    const message = isNetworkError
      ? i18next.t("errors.network")
      : data?.message || error.message || i18next.t("errors.unknown");

    const apiError = new ApiError(message, status, data);

    if (status !== 401 && status !== 422) {
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

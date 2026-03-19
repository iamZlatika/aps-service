import axios, { type AxiosError } from "axios";
import i18next from "i18next";

import { authService } from "@/features/auth/lib/authService.ts";
import { logout } from "@/features/auth/lib/sessionManager.ts";
import { type ServerErrorResponse } from "@/shared/api/types.ts";
import { ApiError } from "@/shared/lib/errors/services.ts";
import { captureError } from "@/shared/lib/sentry.ts";

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
    const token = authService.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
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

    if (status === 401 && authService.getToken()) {
      logout();
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

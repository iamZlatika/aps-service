import i18next from "i18next";
import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

import { logout } from "@/features/auth/sessionManager.ts";
import { type ApiError } from "@/shared/api/types.ts";
import { createApiError } from "@/shared/lib/errorHandlers/services.ts";

export const authService = {
  getToken: (): string | undefined => Cookies.get("auth_token"),
  setToken: (token: string, expiresDays = 365) =>
    Cookies.set("auth_token", token, {
      expires: expiresDays,
      secure: true,
      sameSite: "strict",
    }),
  clearToken: () => Cookies.remove("auth_token"),
};

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
  },
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

let isLoggingOut = false;

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status;
    const data = error.response?.data;
    if (status === 401 && !isLoggingOut) {
      isLoggingOut = true;

      authService.clearToken();
      logout();

      setTimeout(() => {
        isLoggingOut = false;
      }, 2000);
    }

    const message =
      data?.message || error.message || i18next.t("errors.unknown");

    return Promise.reject(createApiError(message, status, data));
  },
);

export const get = <T = unknown>(url: string, config?: AxiosRequestConfig) =>
  apiClient.get<T>(url, config).then((res) => res.data);

export const post = <T = unknown, R = unknown>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig,
) => apiClient.post<R>(url, data, config).then((res) => res.data);

export const put = <T = unknown, R = unknown>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig,
) => apiClient.put<R>(url, data, config).then((res) => res.data);

export const del = <R = unknown>(url: string, config?: AxiosRequestConfig) =>
  apiClient.delete<R>(url, config).then((res) => res.data);

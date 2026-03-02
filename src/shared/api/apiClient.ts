import axios, { type AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

import { type ApiError } from "@/shared/api/types.ts";

// Auth Service
export const authService = {
  getToken: (): string | undefined => Cookies.get("auth_token"),
  setToken: (token: string, expiresDays = 7) =>
    Cookies.set("auth_token", token, { expires: expiresDays }),
  clearToken: () => Cookies.remove("auth_token"),
};

// API Client
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
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

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    const message = data?.message || error.message || "Неизвестная ошибка";

    return Promise.reject({
      message,
      status,
      data,
    } satisfies ApiError<unknown>);
  },
);

// Typed request helpers (optional)
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

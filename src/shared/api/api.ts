import type { AxiosRequestConfig } from "axios";

import { apiClient } from "./apiClient";

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

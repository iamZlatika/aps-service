import type { AxiosRequestConfig } from "axios";

import { apiClient } from "./apiClient";

export const buildPaginatedParams = (
  page: number,
  perPage: number,
  sortColumn?: string | null,
  sortType?: string,
  filters?: Record<string, string>,
): URLSearchParams => {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });
  if (sortColumn && sortType && sortType !== "none") {
    params.set("sort_column", sortColumn);
    params.set("sort_type", sortType);
  }
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
  }
  return params;
};

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

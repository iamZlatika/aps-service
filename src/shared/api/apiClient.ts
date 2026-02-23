import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import Cookies from "js-cookie";

// ---- Auth Service ----
export const authService = {
  getToken: (): string | undefined => Cookies.get("auth_token"),
  setToken: (token: string, expiresDays = 7) =>
    Cookies.set("auth_token", token, { expires: expiresDays }),
  clearToken: () => Cookies.remove("auth_token"),
};

// ---- API Client ----
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ---- Request Interceptor ----
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

// ---- Response Interceptor ----
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      authService.clearToken();
      // редирект на страницу логина
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } else if (error.response?.data?.message) {
      console.error("API Error:", error.response.data.message);
    } else {
      console.error("API Error:", error.message);
    }

    return Promise.reject(error);
  },
);

// ---- Typed request helpers (optional) ----
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

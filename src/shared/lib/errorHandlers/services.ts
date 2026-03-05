import { type ApiError } from "@/shared/api/types.ts";

export function isApiError<T>(error: unknown): error is ApiError<T> {
  return typeof error === "object" && error !== null && "message" in error;
}

export function createApiError<T>(
  message: string,
  status?: number,
  data?: T,
): ApiError<T> {
  const error = new Error(message) as ApiError<T>;
  error.name = "ApiError";
  error.status = status;
  error.data = data;
  return error;
}

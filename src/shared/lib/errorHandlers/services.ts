import { type ApiError } from "@/shared/api/types.ts";

export function isApiError<T>(error: unknown): error is ApiError<T> {
  return typeof error === "object" && error !== null && "message" in error;
}

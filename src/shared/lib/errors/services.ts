import i18next from "i18next";
import { toast } from "sonner";

import { type ApiError } from "@/shared/api/types.ts";

export function isApiError<T = unknown>(error: unknown): error is ApiError<T> {
  if (typeof error !== "object" || error === null) return false;

  const e = error as Record<string, unknown>;

  if (e.name !== "ApiError") return false;
  if (typeof e.message !== "string") return false;

  return !(
    "status" in e &&
    e.status !== undefined &&
    typeof e.status !== "number"
  );
}

export function createApiError<T>(
  message: string,
  status?: number,
  data?: T,
): ApiError<T> {
  return {
    name: "ApiError",
    message,
    status,
    data,
  };
}
export function notifyError(
  error: unknown,
  fallback = i18next.t("errors.unknown"),
) {
  if (isApiError(error)) {
    if (error.status === 403) {
      toast.error(i18next.t("errors.forbidden_action"));
      return;
    }

    toast.error(error.message || fallback);
    return;
  }

  toast.error(fallback);
}

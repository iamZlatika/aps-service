import i18next from "i18next";
import { toast } from "sonner";

import { captureError } from "@/shared/lib/sentry.ts";

export class ApiError<T = unknown> extends Error {
  readonly __apiError = true as const;
  readonly status?: number;
  readonly data?: T;

  constructor(message: string, status?: number, data?: T) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function isApiError<T = unknown>(error: unknown): error is ApiError<T> {
  return (
    error instanceof ApiError ||
    (typeof error === "object" &&
      error !== null &&
      "__apiError" in error &&
      (error as ApiError).__apiError)
  );
}

export function notifyError(
  error: unknown,
  fallback = i18next.t("errors.unknown"),
) {
  if (!isApiError(error)) {
    captureError(error, { source: "notifyError" });
    toast.error(fallback);
    return;
  }

  if (error.status === 403) {
    toast.error(i18next.t("errors.forbidden_action"));
    return;
  }

  toast.error(error.message || fallback);
}

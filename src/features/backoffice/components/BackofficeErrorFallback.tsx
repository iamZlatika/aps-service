import i18next from "i18next";
import { useMemo } from "react";
import type { FallbackProps } from "react-error-boundary";

import PageError from "@/shared/components/errors/ErrorPage.tsx";

export function BackofficeErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const description = useMemo(() => {
    if (!import.meta.env.DEV) return undefined;

    if (error instanceof Error) return error.message;

    try {
      return typeof error === "string" ? error : JSON.stringify(error);
    } catch {
      return String(error);
    }
  }, [error]);

  return (
    <PageError
      title={i18next.t("errors.unknown")}
      description={description}
      onRetry={() => resetErrorBoundary()}
      buttonLabel={i18next.t("errors.retry")}
    />
  );
}

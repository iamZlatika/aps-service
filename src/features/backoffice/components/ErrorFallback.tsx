import * as Sentry from "@sentry/react";
import i18next from "i18next";
import { useMemo } from "react";
import type { FallbackProps } from "react-error-boundary";

import PageError from "@/shared/components/errors/ErrorPage.tsx";

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const eventId = Sentry.lastEventId();

  const description = useMemo(() => {
    if (import.meta.env.DEV) {
      if (error instanceof Error) return error.message;

      try {
        return typeof error === "string" ? error : JSON.stringify(error);
      } catch {
        return String(error);
      }
    }

    if (eventId) {
      return `${i18next.t("errors.error_id")}: ${eventId}`;
    }

    return undefined;
  }, [error, eventId]);

  return (
    <PageError
      title={i18next.t("errors.unknown")}
      description={description}
      onRetry={() => resetErrorBoundary()}
      buttonLabel={i18next.t("errors.retry")}
    />
  );
}

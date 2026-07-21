import i18next from "i18next";
import type { FallbackProps } from "react-error-boundary";

import PageError from "@/shared/components/errors/ErrorPage.tsx";
import { getErrorDescription } from "@/shared/lib/errors/getErrorDescription";
import { getLastEventId } from "@/shared/lib/sentry.ts";

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const description = getErrorDescription(error, getLastEventId());

  return (
    <PageError
      title={i18next.t("errors.unknown")}
      description={description}
      onRetry={resetErrorBoundary}
      buttonLabel={i18next.t("errors.retry")}
    />
  );
}

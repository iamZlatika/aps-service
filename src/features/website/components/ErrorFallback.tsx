import * as Sentry from "@sentry/react";
import i18next from "i18next";
import { AlertTriangle } from "lucide-react";
import type { FallbackProps } from "react-error-boundary";

import { getErrorDescription } from "@/shared/lib/errors/getErrorDescription";

export const WebsiteErrorFallback = ({
  error,
  resetErrorBoundary,
}: FallbackProps) => {
  const description = getErrorDescription(error, Sentry.lastEventId());

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <AlertTriangle className="size-10 text-[var(--ws-ember-bright)]" />

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-[var(--ws-ink)]">
            {i18next.t("errors.unknown")}
          </h2>
          {description && (
            <p className="text-sm text-[var(--ws-ink-mute)]">{description}</p>
          )}
        </div>

        <button
          type="button"
          onClick={resetErrorBoundary}
          className="ws-btn ws-btn-ghost"
        >
          {i18next.t("errors.retry")}
        </button>
      </div>
    </div>
  );
};

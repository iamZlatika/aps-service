import * as Sentry from "@sentry/react";

export function initSentry() {
  if (!import.meta.env.VITE_SENTRY_DSN) return;

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    enabled: import.meta.env.PROD,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.2,
  });
}

export function captureError(
  error: unknown,
  context?: Record<string, unknown>,
) {
  if (import.meta.env.PROD) {
    Sentry.captureException(error, { extra: context });
  } else {
    console.error("[Sentry would capture]:", error, context);
  }
}

export function captureErrorWithId(
  error: unknown,
  context?: Record<string, unknown>,
): string | null {
  if (import.meta.env.PROD) {
    return Sentry.captureException(error, { extra: context });
  }
  console.error("[Sentry would capture]:", error, context);
  return null;
}

import * as Sentry from "@sentry/react";

export function initSentry() {
  if (!import.meta.env.VITE_SENTRY_DSN) return;

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE, // "development" | "production"
    enabled: import.meta.env.PROD, // только в проде
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.2, // 20% запросов для performance monitoring
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

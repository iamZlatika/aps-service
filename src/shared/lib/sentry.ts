import type * as SentryFactoryModule from "@/shared/lib/sentryFactory";

type SentryFactory = typeof SentryFactoryModule;

let factory: SentryFactory | null = null;
let loadingPromise: Promise<SentryFactory> | null = null;

function ensureFactory(): Promise<SentryFactory> {
  loadingPromise ??= import("@/shared/lib/sentryFactory").then((module) => {
    factory = module;
    return module;
  });
  return loadingPromise;
}

export function initSentry(): void {
  if (!import.meta.env.VITE_SENTRY_DSN) return;

  void ensureFactory().then((module) => module.initSentryInstance());
}

export function captureError(
  error: unknown,
  context?: Record<string, unknown>,
): void {
  if (!import.meta.env.PROD) {
    console.error("[Sentry would capture]:", error, context);
    return;
  }

  if (factory) {
    factory.captureExceptionInstance(error, context);
  } else {
    void ensureFactory().then((module) =>
      module.captureExceptionInstance(error, context),
    );
  }
}

export function captureErrorWithId(
  error: unknown,
  context?: Record<string, unknown>,
): string | null {
  if (!import.meta.env.PROD) {
    console.error("[Sentry would capture]:", error, context);
    return null;
  }

  if (factory) {
    return factory.captureExceptionInstance(error, context);
  }

  void ensureFactory().then((module) =>
    module.captureExceptionInstance(error, context),
  );
  return null;
}

export function getLastEventId(): string | undefined {
  return factory?.lastEventIdInstance();
}

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { isApiError } from "@/shared/lib/errors/services.ts";
import PageError from "@/shared/components/errors/ErrorPage.tsx";

interface QueryPageGuardProps {
  isError: boolean;
  error: unknown;
  onRetry?: () => void;

  isLoading?: boolean;
  loadingFallback?: ReactNode;

  title?: string;
  unknownMessage?: string;

  children: ReactNode;
}

export function QueryPageGuard({
  isError,
  error,
  onRetry,
  isLoading,
  loadingFallback = null,
  title,
  unknownMessage,
  children,
}: QueryPageGuardProps) {
  const { t } = useTranslation();

  if (isLoading) return loadingFallback;

  if (isError) {
    return (
      <PageError
        title={title ?? t("errors.failed_to_load")}
        description={
          isApiError(error)
            ? error.message
            : (unknownMessage ?? t("errors.unknown"))
        }
        onRetry={onRetry}
        buttonLabel={t("errors.retry")}
      />
    );
  }

  return children;
}

import type { ReactNode } from "react";

import { QueryPageGuard } from "@/shared/components/errors/QueryPageGuard.tsx";
import { isApiError } from "@/shared/lib/errors/services.ts";

import { StatisticsEmptyState } from "./StatisticsEmptyState.tsx";
import { StatisticsSectionSkeleton } from "./StatisticsSectionSkeleton.tsx";

interface StatisticsSectionGuardProps {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isEmpty: boolean;
  onRetry?: () => void;
  children: ReactNode;
}

// 403 hides the section entirely rather than showing an error/retry state — a
// manager without rights to see this particular section shouldn't get a dead
// "failed to load" box that retries forever, per the statistics access rules.
export const StatisticsSectionGuard = ({
  isLoading,
  isError,
  error,
  isEmpty,
  onRetry,
  children,
}: StatisticsSectionGuardProps) => {
  if (isError && isApiError(error) && error.status === 403) {
    return null;
  }

  return (
    <QueryPageGuard
      isLoading={isLoading}
      loadingFallback={<StatisticsSectionSkeleton />}
      isError={isError}
      error={error}
      onRetry={onRetry}
    >
      {isEmpty ? <StatisticsEmptyState /> : children}
    </QueryPageGuard>
  );
};

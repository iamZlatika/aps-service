import type { CSSProperties, ReactNode } from "react";

import {
  PULL_TO_REFRESH_STATUS,
  type PullToRefreshStatus,
} from "@/shared/lib/pullToRefresh";

interface PullToRefreshIndicatorProps {
  status: PullToRefreshStatus;
  progress: number;
  refreshingLabel: string;
  children: ReactNode;
}

export const PullToRefreshIndicator = ({
  status,
  progress,
  refreshingLabel,
  children,
}: PullToRefreshIndicatorProps) => {
  const isRefreshing = status === PULL_TO_REFRESH_STATUS.REFRESHING;
  const isVisible = status !== PULL_TO_REFRESH_STATUS.IDLE;
  const visibility = isRefreshing ? 1 : Math.min(progress, 1);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center pt-3">
      {isVisible && (
        <div
          aria-hidden="true"
          className="scale-[var(--pull-visibility)] opacity-[var(--pull-visibility)]"
          style={{ "--pull-visibility": visibility } as CSSProperties}
        >
          {children}
        </div>
      )}
      <span className="sr-only" role="status" aria-live="polite">
        {isRefreshing ? refreshingLabel : ""}
      </span>
    </div>
  );
};

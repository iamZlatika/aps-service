import {
  PULL_TO_REFRESH_STATUS,
  type PullToRefreshStatus,
} from "@/shared/lib/pullToRefresh";

interface PullToRefreshBackdropProps {
  status: PullToRefreshStatus;
}

export const PullToRefreshBackdrop = ({
  status,
}: PullToRefreshBackdropProps) => {
  const isRefreshing = status === PULL_TO_REFRESH_STATUS.REFRESHING;

  if (!isRefreshing) return null;

  return (
    <div
      aria-hidden="true"
      // no ws-* overlay token exists yet; opacity matches the bg-black overlay pattern used in ProfileAvatar.tsx
      className="fixed inset-x-0 bottom-0 top-[var(--ws-header-height,0px)] z-10 bg-black/20 transition-opacity duration-200"
    />
  );
};

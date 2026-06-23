import type { ReactNode } from "react";

interface PullToRefreshLoaderFrameProps {
  scaleClassName: string;
  children: ReactNode;
}

export const PullToRefreshLoaderFrame = ({
  scaleClassName,
  children,
}: PullToRefreshLoaderFrameProps) => (
  <div className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden">
    <div className={scaleClassName}>{children}</div>
  </div>
);

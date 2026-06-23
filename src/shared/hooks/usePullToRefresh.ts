import { useQueryClient } from "@tanstack/react-query";
import { type RefObject, useEffect, useRef, useState } from "react";

import { useIsMobile } from "@/shared/hooks/useMobile";
import {
  calculatePullDistance,
  isPullThresholdMet,
  PULL_MAX_DISTANCE_PX,
  PULL_THRESHOLD_PX,
  PULL_TO_REFRESH_STATUS,
  type PullToRefreshStatus,
} from "@/shared/lib/pullToRefresh";

type UsePullToRefreshResult = {
  progress: number;
  status: PullToRefreshStatus;
};

function isScrollableAncestorBlocking(
  target: EventTarget | null,
  container: HTMLElement,
): boolean {
  let node = target instanceof Element ? target : null;
  while (node && node !== container) {
    const isScrollable =
      node.scrollHeight > node.clientHeight &&
      getComputedStyle(node).overflowY !== "visible";
    if (isScrollable && node.scrollTop > 0) return true;
    node = node.parentElement;
  }
  return false;
}

export const usePullToRefresh = (
  containerRef: RefObject<HTMLElement | null>,
): UsePullToRefreshResult => {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [pullDistance, setPullDistance] = useState(0);
  const [status, setStatus] = useState<PullToRefreshStatus>(
    PULL_TO_REFRESH_STATUS.IDLE,
  );
  const startYRef = useRef<number | null>(null);
  const eligibleRef = useRef(false);
  const pullDistanceRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isMobile) return;

    const onTouchStart = (e: TouchEvent) => {
      const isAtTop = container.scrollTop === 0;
      const isLocked = getComputedStyle(container).overflowY === "hidden";
      const isBlocked = isScrollableAncestorBlocking(e.target, container);
      eligibleRef.current = isAtTop && !isLocked && !isBlocked;
      startYRef.current = eligibleRef.current ? e.touches[0].clientY : null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!eligibleRef.current || startYRef.current === null) return;
      const deltaY = e.touches[0].clientY - startYRef.current;
      const distance = calculatePullDistance(deltaY, PULL_MAX_DISTANCE_PX);
      pullDistanceRef.current = distance;

      if (distance <= 0) {
        setPullDistance(0);
        setStatus(PULL_TO_REFRESH_STATUS.IDLE);
        return;
      }

      e.preventDefault();
      setPullDistance(distance);
      setStatus(
        isPullThresholdMet(distance, PULL_THRESHOLD_PX)
          ? PULL_TO_REFRESH_STATUS.READY
          : PULL_TO_REFRESH_STATUS.PULLING,
      );
    };

    const resetPull = () => {
      pullDistanceRef.current = 0;
      setStatus(PULL_TO_REFRESH_STATUS.IDLE);
      setPullDistance(0);
    };

    const onTouchEnd = () => {
      if (!eligibleRef.current) return;
      eligibleRef.current = false;
      startYRef.current = null;

      if (isPullThresholdMet(pullDistanceRef.current, PULL_THRESHOLD_PX)) {
        setStatus(PULL_TO_REFRESH_STATUS.REFRESHING);
        void queryClient.invalidateQueries().finally(resetPull);
      } else {
        resetPull();
      }
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd);

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [containerRef, isMobile, queryClient]);

  useEffect(() => {
    containerRef.current?.style.setProperty(
      "--pull-distance",
      `${pullDistance}px`,
    );
  }, [containerRef, pullDistance]);

  return { progress: pullDistance / PULL_THRESHOLD_PX, status };
};

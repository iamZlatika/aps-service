export const PULL_TO_REFRESH_STATUS = {
  IDLE: "idle",
  PULLING: "pulling",
  READY: "ready",
  REFRESHING: "refreshing",
} as const;

export type PullToRefreshStatus =
  (typeof PULL_TO_REFRESH_STATUS)[keyof typeof PULL_TO_REFRESH_STATUS];

export const PULL_THRESHOLD_PX = 70;
export const PULL_MAX_DISTANCE_PX = 120;
export const PULL_RESISTANCE = 0.5;

export function calculatePullDistance(
  deltaY: number,
  maxDistance: number,
): number {
  if (deltaY <= 0) return 0;
  return Math.min(maxDistance, deltaY * PULL_RESISTANCE);
}

export function isPullThresholdMet(
  distance: number,
  threshold: number,
): boolean {
  return distance >= threshold;
}

export const REFERRAL_DIRECTIONS = {
  ACCRUE: "accrue",
  DEDUCT: "deduct",
} as const;
export type ReferralDirection =
  (typeof REFERRAL_DIRECTIONS)[keyof typeof REFERRAL_DIRECTIONS];

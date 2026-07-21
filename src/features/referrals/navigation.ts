const BASE = "/referrals";

export const REFERRALS_LINKS = {
  root: () => BASE,
  transactions: (id: number) => `${BASE}/${id}/transactions`,
} as const;

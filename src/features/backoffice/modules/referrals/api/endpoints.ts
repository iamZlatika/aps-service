const BASE = "/backoffice/referrals";

export const REFERRALS_API = {
  referrals: () => BASE,
  referral: (id: number) => `${BASE}/${id}`,
  transactions: (id: number) => `${BASE}/${id}/transactions`,
  adjust: (id: number) => `${BASE}/${id}/adjust`,
} as const;

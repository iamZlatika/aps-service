const BASE = "/profile";

export const PROFILE_LINKS = {
  root: () => BASE,
  finance: () => `${BASE}/finance`,
} as const;

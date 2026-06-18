const BASE = "/api/profile";

export const CUSTOMER_PROFILE_API = {
  update: () => BASE,
  avatar: () => `${BASE}/avatar`,
  changePassword: () => `${BASE}/password`,
  changeEmail: () => `${BASE}/email/change`,
} as const;

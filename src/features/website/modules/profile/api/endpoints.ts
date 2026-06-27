const BASE = "/api/profile";

export const CUSTOMER_PROFILE_API = {
  update: () => BASE,
  avatar: () => `${BASE}/avatar`,
  changePassword: () => `${BASE}/password`,
  changeEmail: () => `${BASE}/email/change`,
  primaryPhone: () => `${BASE}/phone`,
  phones: () => `${BASE}/phones`,
  phoneById: (id: number) => `${BASE}/phones/${id}`,
  generateTelegramLink: () => `${BASE}/telegram/generate-link`,
  revokeTelegramLink: () => `${BASE}/telegram/revoke-link`,
} as const;

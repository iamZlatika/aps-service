const BASE = "/backoffice/users";

export const PROFILE_API = {
  avatar: () => `${BASE}/avatar`,
  update: () => `${BASE}`,
  changePassword: () => "/backoffice/auth/change-password",
} as const;

const BASE = "/backoffice/users";

export const USERS_API = {
  me: () => `${BASE}/me`,
  updateLocale: () => `${BASE}/locale`,
  updateTheme: () => `${BASE}/theme`,
  users: () => BASE,
} as const;

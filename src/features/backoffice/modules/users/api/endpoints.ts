const BASE = "/backoffice/users";

export const USERS_API = {
  me: () => `${BASE}/me`,
  updateLocale: () => `${BASE}/locale`,
  updateTheme: () => `${BASE}/theme`,
  updateUserStatus: (id: number) => `${BASE}/${id}/status`,
  users: () => BASE,
} as const;

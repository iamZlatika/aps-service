const BASE = "/backoffice/users";

export const USERS_API = {
  me: () => `${BASE}/me`,
  users: () => BASE,
} as const;

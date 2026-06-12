const BASE = "/api/auth";

export const WEBSITE_AUTH_API = {
  register: () => `${BASE}/register`,
  login: () => `${BASE}/login`,
} as const;

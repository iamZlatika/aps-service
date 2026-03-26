const BASE = "/backoffice/users";

export const PROFILE_API = {
  avatar: () => `${BASE}/avatar`,
} as const;

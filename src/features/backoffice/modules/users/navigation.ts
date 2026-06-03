const BASE = "/backoffice/users";

export const USERS_LINKS = {
  root: () => BASE,
  detail: (id: number) => `${BASE}/${id}`,
} as const;

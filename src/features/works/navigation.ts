const BASE = "/works";

export const WORKS_LINKS = {
  root: () => BASE,
  create: () => `${BASE}/create`,
  edit: (id: number) => `${BASE}/${id}/edit`,
} as const;

const BASE = "/backoffice/works";

export const WORKS_LINKS = {
  root: () => BASE,
  create: () => `${BASE}/create`,
  detail: (id: number) => `${BASE}/${id}`,
} as const;

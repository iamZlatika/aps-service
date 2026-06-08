const BASE = "/backoffice/works";

export const WORKS_LINKS = {
  root: () => BASE,
  create: () => `${BASE}/create`,
} as const;

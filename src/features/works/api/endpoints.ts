const BASE = "/backoffice/landing-works";

export const WORKS_API = {
  list: () => BASE,
  item: (id: number) => `${BASE}/${id}`,
  publish: (id: number) => `${BASE}/${id}/is-published`,
} as const;

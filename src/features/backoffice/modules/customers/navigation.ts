const BASE = "/customers";

export const CUSTOMERS_LINKS = {
  root: () => BASE,
  detail: (id: number) => `${BASE}/${id}`,
} as const;

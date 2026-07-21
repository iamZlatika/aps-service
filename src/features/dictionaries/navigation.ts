const BASE = "/dictionaries";

export const DICTIONARIES_LINKS = {
  root: () => BASE,
  accessories: () => `${BASE}/accessories`,
  deviceConditions: () => `${BASE}/device-conditions`,
  issueTypes: () => `${BASE}/issue-types`,
  deviceModels: () => `${BASE}/device-models`,
  deviceTypes: () => `${BASE}/device-types`,
  intakeNotes: () => `${BASE}/intake-notes`,
  manufacturers: () => `${BASE}/manufacturers`,
  services: () => `${BASE}/services`,
  orderStatuses: () => `${BASE}/order-statuses`,
  suppliers: () => `${BASE}/suppliers`,
  outsourcers: () => `${BASE}/outsourcers`,
  products: () => `${BASE}/products`,
  locations: () => `${BASE}/locations`,
  bankCards: () => `${BASE}/bank-cards`,
  priceList: () => `${BASE}/price-list`,
} as const;

const BASE = "/backoffice/dictionaries";

export const DICTIONARIES_LINKS = {
  root: () => BASE,
  accessories: () => `${BASE}/accessories`,
  deviceConditions: () => `${BASE}/device-conditions`,
  issueTypes: () => `${BASE}/issue-types`,
  deviceModels: () => `${BASE}/device-models`,
  deviceTypes: () => `${BASE}/device-types`,
  intakeNotes: () => `${BASE}/intake-notes`,
  manufacturers: () => `${BASE}/manufacturers`,
  repairOperations: () => `${BASE}/repair-operations`,
  orderStatuses: () => `${BASE}/order-statuses`,
} as const;

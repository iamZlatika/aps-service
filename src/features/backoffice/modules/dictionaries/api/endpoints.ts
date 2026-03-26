const BASE = "/backoffice/dictionaries";

export const DICTIONARIES_API = {
  accessories: () => `${BASE}/accessories`,
  accessory: (id: number) => `${BASE}/accessories/${id}`,
  issueTypes: () => `${BASE}/issue-types`,
  issueType: (id: number) => `${BASE}/issue-types/${id}`,
  deviceConditions: () => `${BASE}/device-conditions`,
  deviceCondition: (id: number) => `${BASE}/device-conditions/${id}`,
  deviceModels: () => `${BASE}/device-models`,
  deviceModel: (id: number) => `${BASE}/device-models/${id}`,
  deviceTypes: () => `${BASE}/device-types`,
  deviceType: (id: number) => `${BASE}/device-types/${id}`,
  intakeNotes: () => `${BASE}/intake-notes`,
  intakeNote: (id: number) => `${BASE}/intake-notes/${id}`,
  manufacturers: () => `${BASE}/manufacturers`,
  manufacturer: (id: number) => `${BASE}/manufacturers/${id}`,
  repairOperations: () => `${BASE}/repair-operations`,
  repairOperation: (id: number) => `${BASE}/repair-operations/${id}`,
} as const;

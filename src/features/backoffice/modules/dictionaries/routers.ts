export const DictionariesRoutes = {
  //router
  dictionariesList: () => "dictionaries",
  accessories: () => "dictionaries/accessories",
  deviceConditions: () => "dictionaries/device-conditions",
  issueTypes: () => "dictionaries/issue-types",
  deviceModels: () => "dictionaries/device-models",
  deviceTypes: () => "dictionaries/device-types",
  intakeNotes: () => "dictionaries/intake-notes",
  manufacturers: () => "dictionaries/manufacturers",
  repairOperations: () => "dictionaries/repair-operations",

  // api
  accessoriesApi: () => "/backoffice/dictionaries/accessories",
  accessoryApi: (id: number) => `/backoffice/dictionaries/accessories/${id}`,
  issueTypesApi: () => "/backoffice/dictionaries/issue-types",
  issueTypeApi: (id: number) => `/backoffice/dictionaries/issue-types/${id}`,
  deviceConditionsApi: () => "/backoffice/dictionaries/device-conditions",
  deviceConditionApi: (id: number) =>
    `/backoffice/dictionaries/device-conditions/${id}`,
  deviceModelsApi: () => "/backoffice/dictionaries/device-models",
  deviceModelApi: (id: number) =>
    `/backoffice/dictionaries/device-models/${id}`,
  deviceTypesApi: () => "/backoffice/dictionaries/device-types",
  deviceTypeApi: (id: number) => `/backoffice/dictionaries/device-types/${id}`,
  intakeNotesApi: () => "/backoffice/dictionaries/intake-notes",
  intakeNoteApi: (id: number) => `/backoffice/dictionaries/intake-notes/${id}`,
  manufacturersApi: () => "/backoffice/dictionaries/manufacturers",
  manufacturerApi: (id: number) =>
    `/backoffice/dictionaries/manufacturers/${id}`,
  repairOperationsApi: () => "/backoffice/dictionaries/repair-operations",
  repairOperationApi: (id: number) =>
    `/backoffice/dictionaries/repair-operations/${id}`,

  // navigate
  linkToDictionaries: () => "/backoffice/dictionaries",
  linkToAccessories: () => "/backoffice/dictionaries/accessories",
  linkToIssueTypes: () => "/backoffice/dictionaries/issue-types",
  linkToDeviceConditions: () => "/backoffice/dictionaries/device-conditions",
  linkToDeviceModels: () => "/backoffice/dictionaries/device-models",
  linkToDeviceTypes: () => "/backoffice/dictionaries/device-types",
  linkToIntakeNotes: () => "/backoffice/dictionaries/intake-notes",
  linkToManufacturers: () => "/backoffice/dictionaries/manufacturers",
  linkToRepairOperations: () => "/backoffice/dictionaries/repair-operations",
};

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

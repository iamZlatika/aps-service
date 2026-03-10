export const DictionariesRoutes = {
  //router
  dictionariesList: () => "dictionaries",
  accessories: () => "dictionaries/accessories",

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
  linkToIntakesNotes: () => "/backoffice/dictionaries/intake-notes",
  linkToManufacturers: () => "/backoffice/dictionaries/manufacturers",
  linkToRepairOperations: () => "/backoffice/dictionaries/repair-operations",
};

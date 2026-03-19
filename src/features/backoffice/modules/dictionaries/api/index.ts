import { createDictionaryApi } from "./createDictionaryApi";

export const accessoriesApi = createDictionaryApi({
  list: () => "/backoffice/dictionaries/accessories",
  item: (id) => `/backoffice/dictionaries/accessories/${id}`,
});

export const issueTypesApi = createDictionaryApi({
  list: () => "/backoffice/dictionaries/issue-types",
  item: (id) => `/backoffice/dictionaries/issue-types/${id}`,
});

export const deviceConditionsApi = createDictionaryApi({
  list: () => "/backoffice/dictionaries/device-conditions",
  item: (id) => `/backoffice/dictionaries/device-conditions/${id}`,
});

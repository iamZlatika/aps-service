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

export const deviceModelsApi = createDictionaryApi({
  list: () => "/backoffice/dictionaries/device-models",
  item: (id) => `/backoffice/dictionaries/device-models/${id}`,
});

export const deviceTypesApi = createDictionaryApi({
  list: () => "/backoffice/dictionaries/device-types",
  item: (id) => `/backoffice/dictionaries/device-types/${id}`,
});

export const intakeNotesApi = createDictionaryApi({
  list: () => "/backoffice/dictionaries/intake-notes",
  item: (id) => `/backoffice/dictionaries/intake-notes/${id}`,
});
export const manufacturersApi = createDictionaryApi({
  list: () => "/backoffice/dictionaries/manufacturers",
  item: (id) => `/backoffice/dictionaries/manufacturers/${id}`,
});

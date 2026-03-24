import { DictionariesRoutes } from "@/features/backoffice/modules/dictionaries/routers.ts";

import { createDictionaryApi } from "./createDictionaryApi";

export const accessoriesApi = createDictionaryApi({
  list: () => DictionariesRoutes.accessoriesApi(),
  item: (id) => DictionariesRoutes.accessoryApi(id),
});

export const issueTypesApi = createDictionaryApi({
  list: () => DictionariesRoutes.issueTypesApi(),
  item: (id) => DictionariesRoutes.issueTypeApi(id),
});

export const deviceConditionsApi = createDictionaryApi({
  list: () => DictionariesRoutes.deviceConditionsApi(),
  item: (id) => DictionariesRoutes.deviceConditionApi(id),
});

export const deviceModelsApi = createDictionaryApi({
  list: () => DictionariesRoutes.deviceModelsApi(),
  item: (id) => DictionariesRoutes.deviceModelApi(id),
});

export const deviceTypesApi = createDictionaryApi({
  list: () => DictionariesRoutes.deviceTypesApi(),
  item: (id) => DictionariesRoutes.deviceTypeApi(id),
});

export const intakeNotesApi = createDictionaryApi({
  list: () => DictionariesRoutes.intakeNotesApi(),
  item: (id) => DictionariesRoutes.intakeNoteApi(id),
});
export const manufacturersApi = createDictionaryApi({
  list: () => DictionariesRoutes.manufacturersApi(),
  item: (id) => DictionariesRoutes.manufacturerApi(id),
});
export const repairOperationsApi = createDictionaryApi({
  list: () => DictionariesRoutes.repairOperationsApi(),
  item: (id) => DictionariesRoutes.repairOperationApi(id),
});

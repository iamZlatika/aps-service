import { createDictionaryApi } from "./createDictionaryApi";
import { DICTIONARIES_API } from "./endpoints";
export const accessoriesApi = createDictionaryApi({
  list: () => DICTIONARIES_API.accessories(),
  item: (id) => DICTIONARIES_API.accessory(id),
});
export const issueTypesApi = createDictionaryApi({
  list: () => DICTIONARIES_API.issueTypes(),
  item: (id) => DICTIONARIES_API.issueType(id),
});
export const deviceConditionsApi = createDictionaryApi({
  list: () => DICTIONARIES_API.deviceConditions(),
  item: (id) => DICTIONARIES_API.deviceCondition(id),
});
export const deviceModelsApi = createDictionaryApi({
  list: () => DICTIONARIES_API.deviceModels(),
  item: (id) => DICTIONARIES_API.deviceModel(id),
});
export const deviceTypesApi = createDictionaryApi({
  list: () => DICTIONARIES_API.deviceTypes(),
  item: (id) => DICTIONARIES_API.deviceType(id),
});
export const intakeNotesApi = createDictionaryApi({
  list: () => DICTIONARIES_API.intakeNotes(),
  item: (id) => DICTIONARIES_API.intakeNote(id),
});
export const manufacturersApi = createDictionaryApi({
  list: () => DICTIONARIES_API.manufacturers(),
  item: (id) => DICTIONARIES_API.manufacturer(id),
});
export const repairOperationsApi = createDictionaryApi({
  list: () => DICTIONARIES_API.repairOperations(),
  item: (id) => DICTIONARIES_API.repairOperation(id),
});

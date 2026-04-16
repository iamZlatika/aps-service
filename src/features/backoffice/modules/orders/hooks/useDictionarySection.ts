import { useMemo } from "react";

import {
  accessoriesApi,
  deviceConditionsApi,
  deviceModelsApi,
  deviceTypesApi,
  intakeNotesApi,
  issueTypesApi,
  manufacturersApi,
} from "@/features/backoffice/modules/dictionaries/api";
import { fetchByDictionaryName } from "@/features/backoffice/modules/orders/lib/searchFetchers.ts";

export const useDictionarySection = () =>
  useMemo(
    () => ({
      fetchers: {
        issueTypes: fetchByDictionaryName(issueTypesApi.getAll),
        deviceTypes: fetchByDictionaryName(deviceTypesApi.getAll),
        manufacturers: fetchByDictionaryName(manufacturersApi.getAll),
        deviceModels: fetchByDictionaryName(deviceModelsApi.getAll),
        deviceConditions: fetchByDictionaryName(deviceConditionsApi.getAll),
        accessories: fetchByDictionaryName(accessoriesApi.getAll),
        intakeNotes: fetchByDictionaryName(intakeNotesApi.getAll),
      },
      createItemFns: {
        deviceConditions: (name: string) =>
          deviceConditionsApi.create({ name }).then(() => {}),
        accessories: (name: string) =>
          accessoriesApi.create({ name }).then(() => {}),
      },
    }),
    [],
  );

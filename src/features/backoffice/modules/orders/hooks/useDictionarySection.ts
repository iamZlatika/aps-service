import i18next from "i18next";
import { useMemo } from "react";
import { toast } from "sonner";

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

const createWithToast =
  (apiFn: (payload: { name: string }) => Promise<unknown>) =>
  async (name: string) => {
    await apiFn({ name });
    toast.success(i18next.t("common.successAdd"));
  };

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
        issueTypes: createWithToast(issueTypesApi.create),
        deviceTypes: createWithToast(deviceTypesApi.create),
        manufacturers: createWithToast(manufacturersApi.create),
        deviceModels: createWithToast(deviceModelsApi.create),
        deviceConditions: createWithToast(deviceConditionsApi.create),
        accessories: createWithToast(accessoriesApi.create),
        intakeNotes: createWithToast(intakeNotesApi.create),
      },
    }),
    [],
  );

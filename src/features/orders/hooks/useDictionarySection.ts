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
} from "@/features/dictionaries/api";
import { createNameSearchFetcher } from "@/features/orders/lib/searchFetchers.ts";

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
        issueTypes: createNameSearchFetcher(issueTypesApi.getAll),
        deviceTypes: createNameSearchFetcher(deviceTypesApi.getAll),
        manufacturers: createNameSearchFetcher(manufacturersApi.getAll),
        deviceModels: createNameSearchFetcher(deviceModelsApi.getAll),
        deviceConditions: createNameSearchFetcher(deviceConditionsApi.getAll),
        accessories: createNameSearchFetcher(accessoriesApi.getAll),
        intakeNotes: createNameSearchFetcher(intakeNotesApi.getAll),
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

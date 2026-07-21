import {
  deviceModelsApi,
  deviceTypesApi,
  manufacturersApi,
} from "@/features/dictionaries/api";
import type { PaginatedGetAllFn } from "@/shared/api/types";
import { SEARCH_PAGE_SIZE } from "@/shared/lib/constants";
import type { SearchableSelectOption } from "@/widgets/searchable-select";

function makeFetcher(
  apiFn: PaginatedGetAllFn<{ id: number; name: string }>,
): (search: string) => Promise<SearchableSelectOption[]> {
  return (search) =>
    apiFn(
      1,
      SEARCH_PAGE_SIZE,
      undefined,
      undefined,
      search ? { name: search } : undefined,
    ).then((r) => r.items.map((item) => ({ id: item.id, name: item.name })));
}

export const fetchWorkDeviceTypes = makeFetcher(deviceTypesApi.getAll);
export const fetchWorkManufacturers = makeFetcher(manufacturersApi.getAll);
export const fetchWorkDeviceModels = makeFetcher(deviceModelsApi.getAll);

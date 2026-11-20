import { locationApi } from "@/features/dictionaries/api";
import { warehouseApi } from "@/features/warehouse/api";
import {
  filterByName,
  getDonorTitle,
  getStoragePlaceLabel,
} from "@/features/warehouse/lib/service.ts";
import type {
  WarehouseCategoryKind,
  WarehouseItemKind,
} from "@/features/warehouse/types.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { SEARCH_PAGE_SIZE } from "@/shared/lib/constants.ts";
import type { SearchableSelectOption } from "@/widgets/searchable-select";

export type StoragePlaceOptionMeta = {
  locationName: string | null;
};

// Both dictionaries are small, unpaginated lists — fetch once through the
// query cache and filter on the client instead of a request per keystroke.

export const createCategoryFetcher =
  (kind: WarehouseCategoryKind) =>
  async (search: string): Promise<SearchableSelectOption[]> => {
    const categories = await queryClient.ensureQueryData({
      queryKey: queryKeys.warehouse.categories(kind),
      queryFn: () => warehouseApi.getCategories(kind),
    });
    return filterByName(categories, search).map(({ id, name }) => ({
      id,
      name,
    }));
  };

export const fetchStoragePlaceOptions = async (
  search: string,
): Promise<SearchableSelectOption<StoragePlaceOptionMeta>[]> => {
  const [places, locations] = await Promise.all([
    queryClient.ensureQueryData({
      queryKey: queryKeys.warehouse.storagePlaces(),
      queryFn: () => warehouseApi.getStoragePlaces(),
    }),
    queryClient.ensureQueryData({
      queryKey: queryKeys.dictionaries.locations(),
      queryFn: () => locationApi.getAll(1, 100),
    }),
  ]);
  const locationNames = new Map(
    locations.items.map((location) => [location.id, location.name]),
  );
  return filterByName(places, search).map((place) => ({
    id: place.id,
    name: place.name,
    meta: {
      locationName:
        place.locationId === null
          ? null
          : (locationNames.get(place.locationId) ?? null),
    },
  }));
};

export type DonorOptionMeta = {
  locationName: string | null;
  storagePlaceName: string | null;
};

/** Every listed donor is physically in the workshop — any can be handed over. */
export const fetchAvailableDonorOptions = async (
  search: string,
): Promise<SearchableSelectOption<DonorOptionMeta>[]> => {
  const { items } = await warehouseApi.getDonors(
    1,
    SEARCH_PAGE_SIZE,
    null,
    "none",
    search ? { search } : undefined,
  );
  return items.map((donor) => ({
    id: donor.id,
    name: getDonorTitle(donor) ?? `#${donor.id}`,
    meta: {
      locationName: donor.location?.name ?? null,
      storagePlaceName: getStoragePlaceLabel(donor),
    },
  }));
};

export type WarehouseItemOptionMeta = {
  purchasePrice: string | null;
  kind: WarehouseItemKind;
};

/** Showcase and supplies together (no `kind`) — for donor investments. */
export const fetchWarehouseItemOptions = async (
  search: string,
): Promise<SearchableSelectOption<WarehouseItemOptionMeta>[]> => {
  const { items } = await warehouseApi.getItems(
    1,
    SEARCH_PAGE_SIZE,
    null,
    "none",
    search ? { search } : undefined,
  );
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    meta: { purchasePrice: item.purchasePrice, kind: item.kind },
  }));
};

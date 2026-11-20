import { useQuery } from "@tanstack/react-query";

import { warehouseApi } from "@/features/warehouse/api";
import type { StoragePlace } from "@/features/warehouse/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const NO_PLACES: StoragePlace[] = [];

/** The whole (small, unpaginated) dictionary — same cache as the combobox. */
export const useStoragePlaces = (): StoragePlace[] => {
  const { data } = useQuery({
    queryKey: queryKeys.warehouse.storagePlaces(),
    queryFn: () => warehouseApi.getStoragePlaces(),
  });
  return data ?? NO_PLACES;
};

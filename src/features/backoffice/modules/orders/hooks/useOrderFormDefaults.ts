import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import type { UseFormGetValues, UseFormSetValue } from "react-hook-form";

import { locationApi } from "@/features/backoffice/modules/dictionaries/api";
import type { Location } from "@/features/backoffice/modules/dictionaries/types.ts";
import type { NewOrderSchema } from "@/features/backoffice/modules/orders/lib/schema.ts";
import { usersApi } from "@/features/backoffice/modules/users/api";
import type { User } from "@/features/backoffice/modules/users/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseOrderFormDefaultsReturn = {
  users: User[];
  isLoadingUsers: boolean;
  locations: Location[];
  isLoadingLocations: boolean;
};

export const useOrderFormDefaults = (
  setValue: UseFormSetValue<NewOrderSchema>,
  getValues: UseFormGetValues<NewOrderSchema>,
  user: User | null | undefined,
): UseOrderFormDefaultsReturn => {
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: () => usersApi.getAll(1, 100),
  });

  const { data: locationsData, isLoading: isLoadingLocations } = useQuery({
    queryKey: queryKeys.dictionaries.locations(),
    queryFn: () => locationApi.getAll(1, 100),
  });

  const users = usersData?.items ?? [];
  const locations = useMemo(
    () => locationsData?.items ?? [],
    [locationsData?.items],
  );

  useEffect(() => {
    const userLocationId = user?.location?.id;
    if (
      isLoadingLocations ||
      !locations.length ||
      !userLocationId ||
      getValues("locationId")
    )
      return;
    if (locations.some((loc) => loc.id === userLocationId)) {
      setValue("locationId", userLocationId);
    }
  }, [isLoadingLocations, locations, user?.location?.id, setValue, getValues]);

  return { users, isLoadingUsers, locations, isLoadingLocations };
};

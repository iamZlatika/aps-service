import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import type { Location } from "@/entities/location/types.ts";
import { locationApi } from "@/features/backoffice/modules/dictionaries/api";
import { usersApi } from "@/features/backoffice/modules/users/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseUpdateUserLocationReturn = {
  locations: Location[];
  pendingLocationId: number | null;
  setPendingLocationId: (id: number | null) => void;
  pendingLocation: Location | undefined;
  updateLocation: (locationId: number) => void;
  isPending: boolean;
};

export const useUpdateUserLocation = (
  userId: number,
): UseUpdateUserLocationReturn => {
  const queryClient = useQueryClient();
  const [pendingLocationId, setPendingLocationId] = useState<number | null>(
    null,
  );

  const { data: locationsData } = useQuery({
    queryKey: queryKeys.dictionaries.locations(),
    queryFn: () => locationApi.getAll(1, 100),
  });

  const locations = locationsData?.items ?? [];
  const pendingLocation = locations.find((l) => l.id === pendingLocationId);

  const { mutate, isPending } = useMutation({
    mutationFn: (locationId: number) =>
      usersApi.updateLocation(locationId, userId),
    onSuccess: () => {
      setPendingLocationId(null);
      return queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });

  return {
    locations,
    pendingLocationId,
    setPendingLocationId,
    pendingLocation,
    updateLocation: mutate,
    isPending,
  };
};

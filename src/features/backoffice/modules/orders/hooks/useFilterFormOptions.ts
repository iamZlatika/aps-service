import { useQuery } from "@tanstack/react-query";

import type { Location } from "@/entities/location/types.ts";
import {
  locationApi,
  orderStatusesApi,
} from "@/features/backoffice/modules/dictionaries/api";
import type { OrderStatusDto } from "@/features/backoffice/modules/dictionaries/api/dto.ts";
import { usersApi } from "@/features/backoffice/modules/users/api";
import { type User } from "@/features/backoffice/modules/users/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseFilterFormOptionsReturn = {
  statuses: OrderStatusDto[];
  locations: Location[];
  users: User[];
  isLoadingUsers: boolean;
};

export const useFilterFormOptions = (): UseFilterFormOptionsReturn => {
  const { data: statusesData } = useQuery({
    queryKey: queryKeys.dictionaries.orderStatuses(),
    queryFn: () => orderStatusesApi.getAll(1, 100),
  });

  const { data: locationsData } = useQuery({
    queryKey: queryKeys.dictionaries.locations(),
    queryFn: () => locationApi.getAll(1, 100),
  });

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: () => usersApi.getAll(1, 100),
  });

  return {
    statuses: statusesData?.items ?? [],
    locations: locationsData?.items ?? [],
    users: usersData?.items ?? [],
    isLoadingUsers,
  };
};

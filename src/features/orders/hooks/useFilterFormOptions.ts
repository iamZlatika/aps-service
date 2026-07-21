import { useQuery } from "@tanstack/react-query";

import type { Location } from "@/entities/location/types.ts";
import { type OrderStatus } from "@/entities/order-status/types";
import { locationApi, orderStatusesApi } from "@/features/dictionaries/api";
import { usersApi } from "@/features/users/api";
import { type User } from "@/features/users/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseFilterFormOptionsReturn = {
  statuses: OrderStatus[];
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

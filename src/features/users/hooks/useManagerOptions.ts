import { useQuery } from "@tanstack/react-query";

import { usersApi } from "@/features/users/api";
import { type User } from "@/features/users/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { USER_STATUSES } from "@/shared/types.ts";

type UseManagerOptionsParams = {
  // Forms pick from active users only; filters keep blocked ones so that
  // orders and payments of former employees stay findable.
  activeOnly?: boolean;
};

type UseManagerOptionsReturn = {
  users: User[];
  isLoadingUsers: boolean;
};

const NO_USERS: User[] = [];

export const useManagerOptions = ({
  activeOnly = false,
}: UseManagerOptionsParams = {}): UseManagerOptionsReturn => {
  const { data, isLoading } = useQuery({
    queryKey: activeOnly
      ? queryKeys.users.activeList()
      : queryKeys.users.list(),
    queryFn: () =>
      activeOnly
        ? usersApi.getAll(1, 100, null, "none", {
            status: USER_STATUSES.ACTIVE,
          })
        : usersApi.getAll(1, 100),
  });

  return {
    users: data?.items ?? NO_USERS,
    isLoadingUsers: isLoading,
  };
};

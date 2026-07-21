import { useQuery } from "@tanstack/react-query";

import { usersApi } from "@/features/users/api";
import { type User } from "@/features/users/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseManagerOptionsReturn = {
  users: User[];
  isLoadingUsers: boolean;
};

export const useManagerOptions = (): UseManagerOptionsReturn => {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: () => usersApi.getAll(1, 100),
  });

  return {
    users: data?.items ?? [],
    isLoadingUsers: isLoading,
  };
};

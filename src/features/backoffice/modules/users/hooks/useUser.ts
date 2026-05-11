import { useQuery } from "@tanstack/react-query";

import { usersApi } from "@/features/backoffice/modules/users/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";

export const useUser = (userId: number | null) => {
  const { data: user, isLoading } = useQuery({
    queryKey: queryKeys.users.detail(userId!),
    queryFn: () => usersApi.getUser(userId!),
    enabled: userId !== null,
  });

  return { user, isLoading };
};

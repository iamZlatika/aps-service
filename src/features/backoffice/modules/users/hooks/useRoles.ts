import { useQuery } from "@tanstack/react-query";

import { usersApi } from "@/features/backoffice/modules/users/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";

import type { RoleWithPermissions } from "../types.ts";

export const useRoles = (
  enabled = true,
): { roles: RoleWithPermissions[]; isLoading: boolean } => {
  const { data: roles = [], isLoading } = useQuery({
    queryKey: queryKeys.roles.list(),
    queryFn: usersApi.getRoles,
    enabled,
  });

  return { roles, isLoading };
};

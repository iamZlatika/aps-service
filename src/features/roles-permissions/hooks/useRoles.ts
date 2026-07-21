import { useQuery } from "@tanstack/react-query";

import type { RoleWithPermissions } from "@/entities/role/types";
import { rolesPermissionsApi } from "@/features/roles-permissions/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";

export const useRoles = (
  enabled = true,
): { roles: RoleWithPermissions[]; isLoading: boolean } => {
  const { data: roles = [], isLoading } = useQuery({
    queryKey: queryKeys.roles.list(),
    queryFn: rolesPermissionsApi.getRoles,
    enabled,
  });

  return { roles, isLoading };
};

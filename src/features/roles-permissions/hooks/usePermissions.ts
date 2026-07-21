import { useQuery } from "@tanstack/react-query";

import type { Permission } from "@/entities/role/types";
import { rolesPermissionsApi } from "@/features/roles-permissions/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";

export const usePermissions = (
  enabled = true,
): { permissions: Permission[]; isLoading: boolean } => {
  const { data: permissions = [], isLoading } = useQuery({
    queryKey: queryKeys.permissions.list(),
    queryFn: rolesPermissionsApi.getPermissions,
    enabled,
  });

  return { permissions, isLoading };
};

import {
  mapPermissionDtoToPermission,
  mapRoleWithPermissionsDtoToRole,
} from "@/entities/role/adapters";
import {
  PermissionListDtoSchema,
  RoleWithPermissionsDtoSchema,
  RoleWithPermissionsListDtoSchema,
} from "@/entities/role/dto";
import type { Permission, RoleWithPermissions } from "@/entities/role/types";
import { ROLES_PERMISSIONS_API } from "@/features/backoffice/modules/roles-permissions/api/endpoints";
import { get, put } from "@/shared/api/api.ts";
import { parseDto } from "@/shared/api/parseDto";

export const rolesPermissionsApi = {
  getPermissions: async (): Promise<Permission[]> => {
    const response = await get<{ data: unknown[] }>(
      ROLES_PERMISSIONS_API.permissions(),
    );
    return parseDto(PermissionListDtoSchema, response.data).map(
      mapPermissionDtoToPermission,
    );
  },

  getRoles: async (): Promise<RoleWithPermissions[]> => {
    const response = await get<{ data: unknown[] }>(
      ROLES_PERMISSIONS_API.roles(),
    );
    return parseDto(RoleWithPermissionsListDtoSchema, response.data).map(
      mapRoleWithPermissionsDtoToRole,
    );
  },

  updateRolePermissions: async (
    roleId: number,
    permissions: string[],
  ): Promise<RoleWithPermissions> => {
    const response = await put<{ permissions: string[] }, { data: unknown }>(
      ROLES_PERMISSIONS_API.updateRolePermissions(roleId),
      { permissions },
    );
    return mapRoleWithPermissionsDtoToRole(
      parseDto(RoleWithPermissionsDtoSchema, response.data),
    );
  },
};

import type { PermissionDto, RoleWithPermissionsDto } from "./dto";
import type { Permission, RoleWithPermissions } from "./types";

export function mapPermissionDtoToPermission(dto: PermissionDto): Permission {
  return {
    id: dto.id,
    name: dto.name,
    group: dto.group,
    action: dto.action,
  };
}

export function mapRoleWithPermissionsDtoToRole(
  dto: RoleWithPermissionsDto,
): RoleWithPermissions {
  return {
    id: dto.id,
    name: dto.name,
    permissions: dto.permissions,
  };
}

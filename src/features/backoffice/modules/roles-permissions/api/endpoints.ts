const BASE = "/backoffice";

export const ROLES_PERMISSIONS_API = {
  permissions: () => `${BASE}/permissions`,
  roles: () => `${BASE}/roles`,
  updateRolePermissions: (roleId: number) =>
    `${BASE}/roles/${roleId}/permissions`,
} as const;

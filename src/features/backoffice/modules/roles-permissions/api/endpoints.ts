const BASE = "/backoffice";

export const ROLES_PERMISSIONS_API = {
  permissions: () => `${BASE}/permissions?per_page=100`,
  roles: () => `${BASE}/roles?per_page=100`,
  updateRolePermissions: (roleId: number) =>
    `${BASE}/roles/${roleId}/permissions`,
} as const;

export type Permission = {
  id: number;
  name: string;
  group: string;
  action: string;
};

export type RoleWithPermissions = {
  id: number;
  name: string;
  permissions: string[];
};

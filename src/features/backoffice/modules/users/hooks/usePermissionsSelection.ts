import { useMemo, useState } from "react";

import type { RoleWithPermissions } from "@/entities/role/types";

type PermissionsSelectionState = {
  localRoles: string[];
  localPermissions: string[];
  localAbilities: string[];
  toggleRole: (role: string) => void;
  togglePermission: (permission: string) => void;
  isAbilityFromRole: (ability: string) => boolean;
  resetSelection: (roles: string[], permissions: string[]) => void;
};

export const usePermissionsSelection = (
  initialRoles: string[],
  initialPermissions: string[],
  rolesData: RoleWithPermissions[],
): PermissionsSelectionState => {
  const [localRoles, setLocalRoles] = useState<string[]>(initialRoles);
  const [localPermissions, setLocalPermissions] =
    useState<string[]>(initialPermissions);

  const localAbilities = useMemo(() => {
    const abilities = new Set<string>(localPermissions);
    rolesData
      .filter((r) => localRoles.includes(r.name))
      .forEach((r) => r.permissions.forEach((p) => abilities.add(p)));
    return Array.from(abilities);
  }, [localRoles, localPermissions, rolesData]);

  const toggleRole = (role: string): void => {
    setLocalRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const togglePermission = (permission: string): void => {
    setLocalPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission],
    );
  };

  const isAbilityFromRole = (ability: string): boolean =>
    rolesData.some(
      (r) => localRoles.includes(r.name) && r.permissions.includes(ability),
    );

  const resetSelection = (roles: string[], permissions: string[]): void => {
    setLocalRoles(roles);
    setLocalPermissions(permissions);
  };

  return {
    localRoles,
    localPermissions,
    localAbilities,
    toggleRole,
    togglePermission,
    isAbilityFromRole,
    resetSelection,
  };
};

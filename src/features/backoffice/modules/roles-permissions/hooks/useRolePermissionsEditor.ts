import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import type { RoleWithPermissions } from "@/entities/role/types";
import { rolesPermissionsApi } from "@/features/backoffice/modules/roles-permissions/api";
import { usePermissions } from "@/features/backoffice/modules/roles-permissions/hooks/usePermissions.ts";
import { useRoles } from "@/features/backoffice/modules/roles-permissions/hooks/useRoles.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { ROLES } from "@/shared/types.ts";
import {
  type AbilityGroup,
  groupPermissionsByCategory,
} from "@/widgets/ability-badge/abilityGroups";

function findRoleByName(
  roles: RoleWithPermissions[],
  name: string | null,
): RoleWithPermissions | null {
  return roles.find((role) => role.name === name) ?? null;
}

type UseRolePermissionsEditorReturn = {
  roles: RoleWithPermissions[];
  abilityGroups: AbilityGroup[];
  isLoading: boolean;
  selectedRole: RoleWithPermissions | null;
  selectRole: (roleName: string) => void;
  localPermissions: string[];
  toggleAbility: (ability: string) => void;
  isDirty: boolean;
  isReadOnly: boolean;
  isSaving: boolean;
  save: () => void;
  cancel: () => void;
};

export const useRolePermissionsEditor = (): UseRolePermissionsEditorReturn => {
  const queryClient = useQueryClient();
  const { roles, isLoading: isRolesLoading } = useRoles();
  const { permissions, isLoading: isPermissionsLoading } = usePermissions();
  const abilityGroups = groupPermissionsByCategory(permissions);
  const isLoading = isRolesLoading || isPermissionsLoading;
  const [selectedRoleName, setSelectedRoleName] = useState<string | null>(null);
  const [localPermissions, setLocalPermissions] = useState<string[]>([]);

  const selectedRole = findRoleByName(roles, selectedRoleName);

  const selectRole = (roleName: string): void => {
    if (roleName === selectedRoleName) return;
    setSelectedRoleName(roleName);
    setLocalPermissions(findRoleByName(roles, roleName)?.permissions ?? []);
  };

  const { mutate: saveMutation, isPending: isSaving } = useMutation({
    mutationFn: (data: { roleId: number; permissions: string[] }) =>
      rolesPermissionsApi.updateRolePermissions(data.roleId, data.permissions),
    onSuccess: (updatedRole) => {
      queryClient.setQueryData<RoleWithPermissions[]>(
        queryKeys.roles.list(),
        (prev) =>
          prev?.map((role) =>
            role.id === updatedRole.id ? updatedRole : role,
          ) ?? prev,
      );
      setLocalPermissions(updatedRole.permissions);
      toast.success(i18next.t("users.roles_permissions.save_success"));
    },
  });

  const isDirty = useMemo(() => {
    if (!selectedRole) return false;
    const saved = new Set(selectedRole.permissions);
    const local = new Set(localPermissions);
    if (saved.size !== local.size) return true;
    return [...saved].some((permission) => !local.has(permission));
  }, [selectedRole, localPermissions]);

  const toggleAbility = (ability: string): void => {
    setLocalPermissions((prev) =>
      prev.includes(ability)
        ? prev.filter((permission) => permission !== ability)
        : [...prev, ability],
    );
  };

  const save = (): void => {
    if (!selectedRole) return;
    saveMutation({ roleId: selectedRole.id, permissions: localPermissions });
  };

  const cancel = (): void => {
    setLocalPermissions(selectedRole?.permissions ?? []);
  };

  return {
    roles,
    abilityGroups,
    isLoading,
    selectedRole,
    selectRole,
    localPermissions,
    toggleAbility,
    isDirty,
    isReadOnly: selectedRole?.name === ROLES.HEAD_MANAGER,
    isSaving,
    save,
    cancel,
  };
};

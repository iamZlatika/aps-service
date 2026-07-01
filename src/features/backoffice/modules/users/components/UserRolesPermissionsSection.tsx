import type { RoleWithPermissions } from "@/entities/role/types";
import { RolesPermissionsPicker } from "@/features/backoffice/modules/users/components/RolesPermissionsPicker.tsx";
import { useUserPermissionsEditor } from "@/features/backoffice/modules/users/hooks/useUserPermissionsEditor.ts";
import type { AbilityGroup } from "@/widgets/ability-badge/abilityGroups";

interface UserRolesPermissionsSectionProps {
  userId: number;
  initialRoles: string[];
  initialPermissions: string[];
  rolesData: RoleWithPermissions[];
  abilityGroups: AbilityGroup[];
}

export const UserRolesPermissionsSection = ({
  userId,
  initialRoles,
  initialPermissions,
  rolesData,
  abilityGroups,
}: UserRolesPermissionsSectionProps) => {
  const {
    localRoles,
    localAbilities,
    toggleRole,
    togglePermission,
    isAbilityFromRole,
    isPending,
  } = useUserPermissionsEditor(
    userId,
    initialRoles,
    initialPermissions,
    rolesData,
  );

  return (
    <RolesPermissionsPicker
      localRoles={localRoles}
      localAbilities={localAbilities}
      isAbilityFromRole={isAbilityFromRole}
      toggleRole={toggleRole}
      togglePermission={togglePermission}
      isPending={isPending}
      rolesData={rolesData}
      abilityGroups={abilityGroups}
    />
  );
};

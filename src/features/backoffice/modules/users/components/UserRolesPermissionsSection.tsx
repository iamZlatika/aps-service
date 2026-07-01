import { RolesPermissionsPicker } from "@/features/backoffice/modules/users/components/RolesPermissionsPicker.tsx";
import { useUserPermissionsEditor } from "@/features/backoffice/modules/users/hooks/useUserPermissionsEditor.ts";
import type { RoleWithPermissions } from "@/features/backoffice/modules/users/types.ts";

interface UserRolesPermissionsSectionProps {
  userId: number;
  initialRoles: string[];
  initialPermissions: string[];
  rolesData: RoleWithPermissions[];
}

export const UserRolesPermissionsSection = ({
  userId,
  initialRoles,
  initialPermissions,
  rolesData,
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
    />
  );
};

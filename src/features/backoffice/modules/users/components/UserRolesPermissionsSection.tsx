import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ABILITY_GROUPS } from "@/features/backoffice/modules/users/data.ts";
import { useUserPermissionsEditor } from "@/features/backoffice/modules/users/hooks/useUserPermissionsEditor.ts";
import {
  getAbilityClassName,
  getRoleClassName,
} from "@/features/backoffice/modules/users/lib/abilityColors.ts";
import type { RoleWithPermissions } from "@/features/backoffice/modules/users/types.ts";
import { Badge } from "@/shared/components/ui/badge.tsx";
import { cn } from "@/shared/lib/utils.ts";
import { ROLES } from "@/shared/types.ts";

interface UserRolesPermissionsSectionProps {
  userId: number;
  initialRoles: string[];
  initialPermissions: string[];
  rolesData: RoleWithPermissions[];
}

const ALL_ROLES = Object.values(ROLES);

export const UserRolesPermissionsSection = ({
  userId,
  initialRoles,
  initialPermissions,
  rolesData,
}: UserRolesPermissionsSectionProps) => {
  const { t } = useTranslation();
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
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-base font-semibold">
            {t("users.roles_permissions.roles")}
          </p>
          {isPending && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_ROLES.map((role) => (
            <Badge
              key={role}
              onClick={() => !isPending && toggleRole(role)}
              className={cn(
                "text-sm font-medium px-3 py-1 select-none transition-opacity",
                isPending ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
                getRoleClassName(role, localRoles),
              )}
            >
              {t(`users.roles.${role}`)}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <p className="text-base font-semibold mb-3">
          {t("users.roles_permissions.abilities")}
        </p>
        <div className="space-y-3">
          {ABILITY_GROUPS.map((group) => (
            <div key={group.key} className="flex items-start gap-4">
              <span className="text-sm text-muted-foreground w-32 shrink-0 pt-0.5">
                {t(`profile.abilities.groups.${group.key}`)}
              </span>
              <div className="flex flex-wrap gap-2">
                {group.abilities.map((ability) => {
                  const fromRole = isAbilityFromRole(ability);
                  return (
                    <Badge
                      key={ability}
                      onClick={
                        !fromRole && !isPending
                          ? () => togglePermission(ability)
                          : undefined
                      }
                      className={cn(
                        "text-sm font-medium px-3 py-1 select-none transition-opacity",
                        isPending
                          ? "opacity-60 cursor-not-allowed"
                          : fromRole
                            ? "cursor-default"
                            : "cursor-pointer",
                        getAbilityClassName(
                          ability,
                          localAbilities,
                          localRoles,
                          rolesData,
                        ),
                      )}
                    >
                      {t(`profile.abilities.${ability}`)}
                    </Badge>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

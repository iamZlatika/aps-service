import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { RoleWithPermissions } from "@/entities/role/types";
import { Badge } from "@/shared/components/ui/badge.tsx";
import { TooltipProvider } from "@/shared/components/ui/tooltip.tsx";
import { cn } from "@/shared/lib/utils.ts";
import { AbilityBadge } from "@/widgets/ability-badge";
import {
  ALL_ROLES,
  doesRoleGrantAbility,
  getAbilityClassName,
  getHighlightClass,
  getRoleClassName,
} from "@/widgets/ability-badge/abilityColors";
import type { AbilityGroup } from "@/widgets/ability-badge/abilityGroups";

interface RolesPermissionsPickerProps {
  localRoles: string[];
  localAbilities: string[];
  isAbilityFromRole: (ability: string) => boolean;
  toggleRole: (role: string) => void;
  togglePermission: (permission: string) => void;
  isPending: boolean;
  rolesData: RoleWithPermissions[];
  abilityGroups: AbilityGroup[];
}

export const RolesPermissionsPicker = ({
  localRoles,
  localAbilities,
  isAbilityFromRole,
  toggleRole,
  togglePermission,
  isPending,
  rolesData,
  abilityGroups,
}: RolesPermissionsPickerProps) => {
  const { t } = useTranslation();
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  return (
    <TooltipProvider>
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
          <div className="flex flex-wrap items-start gap-2">
            {ALL_ROLES.map((role) => (
              <Badge
                key={role}
                role="button"
                tabIndex={isPending ? -1 : 0}
                aria-pressed={localRoles.includes(role)}
                onClick={() => !isPending && toggleRole(role)}
                onKeyDown={(e) => {
                  if (isPending) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleRole(role);
                  }
                }}
                onMouseEnter={() => setHoveredRole(role)}
                onMouseLeave={() => setHoveredRole(null)}
                className={cn(
                  "text-sm font-medium px-3 py-1 select-none transition-all",
                  isPending
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer",
                  getRoleClassName(role, localRoles),
                  hoveredRole === role && getHighlightClass(role),
                )}
              >
                {t(`users.roles.${role}`)}
              </Badge>
            ))}
            <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-block w-3 h-3 rounded-sm bg-rose-200 dark:bg-rose-800" />
              {t("users.roles_permissions.custom_hint")}
            </span>
          </div>
        </div>

        <div>
          <p className="text-base font-semibold mb-3">
            {t("users.roles_permissions.abilities")}
          </p>
          <div className="space-y-3">
            {abilityGroups.map((group) => (
              <div key={group.key} className="flex items-start gap-4">
                <span className="text-sm text-muted-foreground w-32 shrink-0 pt-0.5">
                  {t(`profile.abilities.groups.${group.key}`, {
                    defaultValue: group.key,
                  })}
                </span>
                <div className="flex flex-wrap gap-2">
                  {group.abilities.map((ability) => {
                    const fromRole = isAbilityFromRole(ability);
                    const isHighlighted =
                      hoveredRole !== null &&
                      doesRoleGrantAbility(ability, hoveredRole, rolesData);
                    return (
                      <AbilityBadge
                        key={ability}
                        label={t(`profile.abilities.${ability}`, {
                          defaultValue: ability,
                        })}
                        colorClass={getAbilityClassName(
                          ability,
                          localAbilities,
                          localRoles,
                          rolesData,
                        )}
                        highlightClass={
                          isHighlighted ? getHighlightClass(hoveredRole) : ""
                        }
                        isActive={localAbilities.includes(ability)}
                        isCustom={localAbilities.includes(ability) && !fromRole}
                        isPending={isPending}
                        fromRole={fromRole}
                        onToggle={
                          !fromRole && !isPending
                            ? () => togglePermission(ability)
                            : undefined
                        }
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

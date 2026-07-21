import { useTranslation } from "react-i18next";

import { useRolePermissionsEditor } from "@/features/roles-permissions/hooks/useRolePermissionsEditor.ts";
import { Loader } from "@/shared/components/common/Loader.tsx";
import { Badge } from "@/shared/components/ui/badge.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { Card, CardContent, CardFooter } from "@/shared/components/ui/card.tsx";
import { cn } from "@/shared/lib/utils.ts";
import { AbilityBadge } from "@/widgets/ability-badge";
import {
  ALL_ROLES,
  getAbilityClassName,
  getRoleBoldClassName,
  getRoleClassName,
  REMOVED_ABILITY_CLASS,
} from "@/widgets/ability-badge/abilityColors";

const RolePermissionsCard = () => {
  const { t } = useTranslation();
  const {
    roles,
    abilityGroups,
    isLoading,
    selectedRole,
    selectRole,
    localPermissions,
    toggleAbility,
    isDirty,
    isReadOnly,
    isSaving,
    save,
    cancel,
  } = useRolePermissionsEditor();

  if (isLoading) return <Loader />;

  return (
    <Card className="max-w-3xl mx-auto w-full">
      <CardContent className="space-y-6 pt-6">
        <div
          role="radiogroup"
          aria-label={t("users.roles_permissions.roles")}
          className="flex flex-wrap items-center gap-2"
        >
          {ALL_ROLES.map((role) => {
            const isSelected = selectedRole?.name === role;
            return (
              <Badge
                key={role}
                role="radio"
                tabIndex={isSaving ? -1 : 0}
                aria-checked={isSelected}
                aria-disabled={isSaving || undefined}
                onClick={() => !isSaving && selectRole(role)}
                onKeyDown={(e) => {
                  if (isSaving) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selectRole(role);
                  }
                }}
                className={cn(
                  "text-sm font-medium px-3 py-1 select-none transition-all",
                  isSaving ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
                  isSelected
                    ? getRoleBoldClassName(role)
                    : getRoleClassName(role, []),
                )}
              >
                {t(`users.roles.${role}`)}
              </Badge>
            );
          })}
        </div>

        {selectedRole && isReadOnly && (
          <p className="text-sm text-muted-foreground">
            {t("users.roles_permissions.head_manager_readonly")}
          </p>
        )}

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
                  const isRemoved =
                    !!selectedRole &&
                    selectedRole.permissions.includes(ability) &&
                    !localPermissions.includes(ability);
                  return (
                    <AbilityBadge
                      key={ability}
                      label={t(`profile.abilities.${ability}`, {
                        defaultValue: ability,
                      })}
                      colorClass={
                        isRemoved
                          ? REMOVED_ABILITY_CLASS
                          : getAbilityClassName(
                              ability,
                              localPermissions,
                              selectedRole ? [selectedRole.name] : [],
                              roles,
                            )
                      }
                      highlightClass=""
                      isActive={localPermissions.includes(ability)}
                      isCustom={false}
                      isRemoved={isRemoved}
                      isPending={isSaving}
                      fromRole={!selectedRole || isReadOnly}
                      onToggle={
                        !selectedRole || isReadOnly || isSaving
                          ? undefined
                          : () => toggleAbility(ability)
                      }
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {isDirty && !isReadOnly && (
        <CardFooter className="justify-end gap-2">
          <Button variant="outline" onClick={cancel} disabled={isSaving}>
            {t("common.cancel")}
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={save}
            disabled={isSaving}
          >
            {isSaving ? t("loader.default") : t("common.save")}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default RolePermissionsCard;

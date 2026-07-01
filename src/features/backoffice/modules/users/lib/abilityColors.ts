import type { Role } from "@/shared/types.ts";

import type { RoleWithPermissions } from "../types.ts";

type RoleColorConfig = {
  bold: string;
  clickable: string;
  static: string;
  highlight: string;
};

export const ROLE_COLORS: Partial<Record<Role, RoleColorConfig>> = {
  head_manager: {
    bold: "bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-black font-semibold",
    clickable:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800",
    static:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    highlight:
      "ring-2 ring-yellow-400 shadow-md shadow-yellow-200 dark:shadow-yellow-900",
  },
  manager: {
    bold: "bg-blue-500 text-white font-semibold",
    clickable:
      "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800",
    static: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    highlight:
      "ring-2 ring-blue-400 shadow-md shadow-blue-200 dark:shadow-blue-900",
  },
  receptionist: {
    bold: "bg-teal-500 text-white font-semibold",
    clickable:
      "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800",
    static: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    highlight:
      "ring-2 ring-teal-400 shadow-md shadow-teal-200 dark:shadow-teal-900",
  },
  accountant: {
    bold: "bg-purple-500 text-white font-semibold",
    clickable:
      "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:hover:bg-purple-800",
    static:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    highlight:
      "ring-2 ring-purple-400 shadow-md shadow-purple-200 dark:shadow-purple-900",
  },
  support: {
    bold: "bg-orange-500 text-white font-semibold",
    clickable:
      "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:hover:bg-orange-800",
    static:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    highlight:
      "ring-2 ring-orange-400 shadow-md shadow-orange-200 dark:shadow-orange-900",
  },
};

export const CUSTOM_ABILITY_CLICKABLE =
  "bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-900 dark:text-rose-200 dark:hover:bg-rose-800";
export const CUSTOM_ABILITY_STATIC =
  "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200";
export const INACTIVE_CLASS =
  "bg-muted text-muted-foreground opacity-40 hover:bg-muted";

export function getRoleBoldClassName(role: string): string {
  return ROLE_COLORS[role as Role]?.bold ?? "bg-gray-400 text-white";
}

// Color is determined by the LAST role in the user's own roles list that grants this ability.
export function getAbilityClassName(
  ability: string,
  localAbilities: string[],
  localRoles: string[],
  rolesData: RoleWithPermissions[],
): string {
  if (!localAbilities.includes(ability)) {
    return INACTIVE_CLASS;
  }

  const matchingRoles = localRoles.filter((roleName) => {
    const roleData = rolesData.find((r) => r.name === roleName);
    return roleData?.permissions.includes(ability) ?? false;
  });

  if (matchingRoles.length === 0) {
    return CUSTOM_ABILITY_CLICKABLE;
  }

  const lastRole = matchingRoles[matchingRoles.length - 1];
  return ROLE_COLORS[lastRole as Role]?.clickable ?? CUSTOM_ABILITY_CLICKABLE;
}

export function getRoleClassName(role: string, localRoles: string[]): string {
  if (!localRoles.includes(role)) {
    return INACTIVE_CLASS;
  }
  return ROLE_COLORS[role as Role]?.clickable ?? CUSTOM_ABILITY_CLICKABLE;
}

export function getHighlightClass(role: string): string {
  return ROLE_COLORS[role as Role]?.highlight ?? "";
}

export function doesRoleGrantAbility(
  ability: string,
  role: string,
  rolesData: RoleWithPermissions[],
): boolean {
  return (
    rolesData.find((r) => r.name === role)?.permissions.includes(ability) ??
    false
  );
}

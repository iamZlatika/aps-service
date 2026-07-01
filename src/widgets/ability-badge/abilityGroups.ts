import type { Permission } from "@/entities/role/types";

export type AbilityGroup = {
  key: string;
  abilities: string[];
};

export function groupPermissionsByCategory(
  permissions: Permission[],
): AbilityGroup[] {
  const groups = new Map<string, string[]>();

  permissions.forEach((permission) => {
    const abilities = groups.get(permission.group) ?? [];
    abilities.push(permission.name);
    groups.set(permission.group, abilities);
  });

  return Array.from(groups, ([key, abilities]) => ({
    key,
    abilities,
  })).reverse();
}

import type { SelectOption } from "@/features/backoffice/widgets/table/models/types.ts";

const USER_ROLE_KEYS = ["manager", "head_manager"] as const;

export const getUserRoleOptions = (
  t: (key: string) => string,
): SelectOption[] =>
  USER_ROLE_KEYS.map((key) => ({
    value: key,
    label: t(`users.roles.${key}`),
  }));

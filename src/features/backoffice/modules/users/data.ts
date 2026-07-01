import type { SelectOption } from "@/features/backoffice/widgets/table/models/types.ts";
import { ROLES } from "@/shared/types.ts";

type AbilityGroup = {
  key: string;
  abilities: readonly string[];
};

export const ABILITY_GROUPS: AbilityGroup[] = [
  { key: "orders", abilities: ["orders_view", "orders_manage"] },
  { key: "customers", abilities: ["customers_view", "customers_manage"] },
  {
    key: "landing_works",
    abilities: ["landing_works_view", "landing_works_manage"],
  },
  {
    key: "billing",
    abilities: [
      "billing_view",
      "billing_manage",
      "billing_system_balance_view",
    ],
  },
  {
    key: "users",
    abilities: ["users_view", "users_manage", "users_roles_permissions_manage"],
  },
  {
    key: "dictionaries",
    abilities: [
      "dictionaries_view",
      "dictionaries_manage",
      "dictionaries_bank_cards_manage",
      "dictionaries_locations_manage",
      "dictionaries_price_list_manage",
    ],
  },
];

export function getUserRoleOptions(t: (key: string) => string): SelectOption[] {
  return Object.values(ROLES).map((key) => ({
    value: key,
    label: t(`users.roles.${key}`),
  }));
}

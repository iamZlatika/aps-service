import type { z } from "zod";

import { type Location } from "@/features/backoffice/modules/dictionaries/types.ts";
import type { registerUserSchema } from "@/features/backoffice/modules/users/lib/registerUserSchema.ts";
import {
  type Role,
  type UserLanguage,
  type UserStatus,
  type UserTheme,
} from "@/shared/types.ts";

export type User = {
  id: number;
  name: string;
  email: string;
  roles: Role[];
  status: UserStatus;
  locale: UserLanguage;
  theme: UserTheme;
  avatarUrl: string;
  location: Location | null;
  servicesPercent: number | null;
  productsPercent: number | null;
  intakePercent: number | null;
};

export type UserDetail = User & {
  permissions: string[];
  abilities: string[];
};

export type NewUser = z.infer<typeof registerUserSchema>;

export type SearchPreset<TFilters> = {
  id: number;
  entity: string;
  name: string;
  filters: TFilters;
  createdAt: string;
  updatedAt: string;
};

export type Me = User & {
  abilities: string[];
  balance: string;
  pendingWithdrawals: string;
  available: string;
  searchPresets: SearchPreset<Record<string, unknown>>[];
};

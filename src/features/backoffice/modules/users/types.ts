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
  role: Role;
  status: UserStatus;
  locale: UserLanguage;
  theme: UserTheme;
  avatarUrl: string;
  location: Location | null;
  servicesPercent: number;
  partsPercent: number;
  intakePercent: number;
};

export type NewUser = z.infer<typeof registerUserSchema>;

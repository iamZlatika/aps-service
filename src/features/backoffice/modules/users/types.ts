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
};

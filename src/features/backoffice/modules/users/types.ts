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

export type NewUser = {
  email: string;
  name: string;
  password: string;
  password_confirmation: string;
  role: Role;
};

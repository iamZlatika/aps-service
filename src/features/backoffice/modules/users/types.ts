import { type Role, type UserStatus } from "@/shared/types.ts";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  avatarUrl: string | null;
};

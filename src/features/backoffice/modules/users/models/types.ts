import { type Role, type UserStatus } from "@/types/types.ts";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
};

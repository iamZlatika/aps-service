import { type Role } from "@/shared/types";

export type ClientUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: Role;
};

export type AuthResponse = {
  token: string;
  user: ClientUser;
};

export type RegistrationResponse = {
  emailVerified: boolean;
};

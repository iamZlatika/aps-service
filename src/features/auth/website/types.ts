import { type UserStatus } from "@/shared/types";

export type CustomerPhone = {
  id: number;
  phoneNumber: string;
  phoneVerifiedAt: string | null;
  isPrimary: boolean;
};

export type Customer = {
  id: number;
  portalName: string | null;
  email: string | null;
  pendingEmail: string | null;
  emailVerifiedAt: string | null;
  hasGoogle: boolean;
  avatarUrl: string;
  phones: CustomerPhone[];
  status: UserStatus;
  lastOrderAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  token: string;
  customer: Customer;
};

export type RegistrationResponse = {
  email: string;
};

export type RegistrationData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
};

export type SendPhoneCodeData = {
  phone: string;
};

export type VerifyPhoneCodeData = {
  code: string;
};

export type CheckResetTokenData = {
  token: string;
  email: string;
};

export type ResetPasswordData = CheckResetTokenData & {
  password: string;
  password_confirmation: string;
};

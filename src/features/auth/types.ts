import { type ResetPasswordFormValues } from "@/features/auth/backoffice/pages/forgot/forgot.schema.ts";
import { type Role, type UserStatus } from "@/shared/types.ts";

export type LoginResponse = {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: Role;
    status: UserStatus;
  };
};

export type SuccessResponse = {
  message: string;
};
export type CheckTokenData = {
  token: string;
  email: string;
};

export type ResetPasswordData = CheckTokenData & ResetPasswordFormValues;

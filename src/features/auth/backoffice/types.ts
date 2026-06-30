import { type ResetPasswordFormValues } from "@/features/auth/backoffice/pages/forgot/forgot.schema.ts";
import { type SuccessResponse, type UserStatus } from "@/shared/types.ts";

export type LoginResponse = {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    roles: string[];
    permissions: string[];
    status: UserStatus;
  };
};

export type { SuccessResponse };

export type CheckTokenData = {
  token: string;
  email: string;
};

export type ResetPasswordData = CheckTokenData & ResetPasswordFormValues;

export type ChangePasswordData = {
  current_password: string;
  password: string;
  password_confirmation: string;
};

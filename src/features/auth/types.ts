import { type ResetPasswordFormValues } from "@/features/auth/backoffice/pages/forgot/forgot.schema.ts";

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
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

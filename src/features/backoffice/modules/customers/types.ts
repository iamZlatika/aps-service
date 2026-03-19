import { type UserStatus } from "@/shared/types.ts";

export type Customer = {
  id: number;
  name: string;
  phones: Phones[];
  email: string | null;
  emailVerifiedAt: string | null;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  status: UserStatus;
};

type Phones = {
  id: number;
  phoneNumber: string;
  phoneVerifiedAt: string | null;
  isPrimary: boolean;
};

import { type UserStatus } from "@/shared/types.ts";

export type Customer = {
  id: number;
  name: string;
  portalName: string | null;
  email: string | null;
  emailVerifiedAt: string | null;
  hasGoogle: boolean;
  telegramChatId: number | null;
  telegramLinkedAt: string | null;
  avatarUrl: string;
  phones: Phone[];
  status: UserStatus;
  rating: RatingValue;
  comment: string | null;
  lastOrderAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Phone = {
  id: number;
  phoneNumber: string;
  phoneVerifiedAt: string | null;
  isPrimary: boolean;
};

export type NewPhone = Pick<Phone, "phoneNumber">;

export type NewCustomer = Pick<Customer, "name" | "email" | "comment"> & {
  phone: string;
};

export type RatingValue = 1 | 2 | 3 | 4 | 5 | null;

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
  phones: Phones[];
  status: UserStatus;
  rating: number | null;
  comment: string | null;
  lastOrderAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Phones = {
  id: number;
  phoneNumber: string;
  phoneVerifiedAt: string | null;
  isPrimary: boolean;
};
type CreatableCustomerFields = "name" | "phones" | "email" | "comment";

export type NewCustomer = Pick<Customer, CreatableCustomerFields>;

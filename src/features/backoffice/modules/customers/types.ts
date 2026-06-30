import type { z } from "zod";

import type { newCustomerSchema } from "@/features/backoffice/modules/customers/lib/schemas.ts";
import { type UserStatus } from "@/shared/types.ts";

export type Telegram = {
  chatId: number | null;
  linkedAt: string | null;
  link: string;
  qrCode: string;
};
export type Customer = {
  id: number;
  name: string;
  portalName: string | null;
  email: string | null;
  emailVerifiedAt: string | null;
  hasGoogle: boolean;
  avatarUrl: string;
  phones: Phone[];
  status: UserStatus;
  rating: RatingValue;
  comment: string | null;
  smsNotificationsEnabled: boolean;
  lastOrderAt: string | null;
  createdAt: string;
  updatedAt: string;
};
export type CustomerInfo = Customer & {
  telegram: Telegram | null;
};
export type Phone = {
  id: number;
  phoneNumber: string;
  phoneVerifiedAt: string | null;
  isPrimary: boolean;
};

export type NewPhone = Pick<Phone, "phoneNumber">;

export type NewCustomer = z.infer<typeof newCustomerSchema>;

export type RatingValue = 1 | 2 | 3 | 4 | 5 | null;

export type EditedCustomer = {
  name: string;
  email: string | null;
  comment: string | null;
};

export type TelegramLink = {
  link: string;
  qrCode: string;
};

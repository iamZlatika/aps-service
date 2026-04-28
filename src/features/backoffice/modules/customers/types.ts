import type { z } from "zod";

import type { newCustomerSchema } from "@/features/backoffice/modules/customers/lib/schemas.ts";
import { type UserStatus } from "@/shared/types.ts";

export type Telegram = {
  chatId: number;
  linkedAt: string;
  activationToken: string | null;
};
export type Customer = {
  id: number;
  name: string;
  portalName: string | null;
  email: string | null;
  emailVerifiedAt: string | null;
  hasGoogle: boolean;
  telegram: Telegram;
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

export type NewCustomer = z.infer<typeof newCustomerSchema>;

export type RatingValue = 1 | 2 | 3 | 4 | 5 | null;

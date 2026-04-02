import { z } from "zod";

import { emailRegex } from "@/shared/lib/constants.ts";
import { zodEnumFromConst } from "@/shared/lib/zod-helpers.ts";
import { USER_STATUSES } from "@/shared/types.ts";

export const CustomerDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  portal_name: z.string().nullable(),
  email: z.string().regex(emailRegex).nullable(),
  email_verified_at: z.string().nullable(),
  has_google: z.boolean(),
  telegram_chat_id: z.number().nullable(),
  telegram_linked_at: z.string().nullable(),
  avatar_url: z.string(),
  phones: z.array(
    z.object({
      id: z.number(),
      phone_number: z.string(),
      phone_verified_at: z.string().nullable(),
      is_primary: z.boolean(),
    }),
  ),
  status: zodEnumFromConst(USER_STATUSES),
  rating: z.number().nullable(),
  comment: z.string().nullable(),
  last_order_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type CustomerDto = z.infer<typeof CustomerDtoSchema>;

export const PaginatedCustomersDtoSchema = z.object({
  data: z.array(CustomerDtoSchema),
  meta: z.object({
    current_page: z.number(),
    last_page: z.number(),
    total: z.number(),
    per_page: z.number(),
    from: z.number().nullable(),
    to: z.number().nullable(),
  }),
});

export type PaginatedCustomersDto = z.infer<typeof PaginatedCustomersDtoSchema>;

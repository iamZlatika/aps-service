import { z } from "zod";

import { CustomerDtoSchema } from "@/features/customers/api/dto.ts";
import { zodEnumFromConst } from "@/shared/lib/zod-helpers.ts";
import { SMS_MESSAGE_STATUSES, SMS_PROVIDERS } from "@/shared/types.ts";

export const SmsBalanceDtoSchema = z.object({
  amount: z.number(),
  low_balance_threshold: z.number(),
  is_low: z.boolean(),
});
export type SmsBalanceDto = z.infer<typeof SmsBalanceDtoSchema>;

export const SmsMessageDtoSchema = z.object({
  id: z.number(),
  customer: CustomerDtoSchema.nullable().optional(),
  provider: zodEnumFromConst(SMS_PROVIDERS),
  provider_message_id: z.string().nullable().optional(),
  phone: z.string(),
  text: z.string(),
  status: zodEnumFromConst(SMS_MESSAGE_STATUSES),
  provider_status: z.string().nullable().optional(),
  price: z.string().nullable().optional(),
  segments: z.number().nullable().optional(),
  error: z.string().nullable().optional(),
  sent_at: z.iso.datetime().nullable().optional(),
  delivered_at: z.iso.datetime().nullable().optional(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});
export type SmsMessageDto = z.infer<typeof SmsMessageDtoSchema>;

const SmsMessagesPaginationMetaDtoSchema = z.object({
  current_page: z.number(),
  per_page: z.number(),
  total: z.number(),
  last_page: z.number(),
});

export const PaginatedSmsMessagesDtoSchema = z.object({
  data: z.array(SmsMessageDtoSchema),
  meta: SmsMessagesPaginationMetaDtoSchema,
});
export type PaginatedSmsMessagesDto = z.infer<
  typeof PaginatedSmsMessagesDtoSchema
>;

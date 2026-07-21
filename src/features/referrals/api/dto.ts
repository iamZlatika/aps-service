import { z } from "zod";

import {
  OrderProductSchema,
  OrderServiceSchema,
  OrderTransactionDtoSchema,
} from "@/features/orders/api/dto.ts";
import { UserDtoSchema } from "@/features/users/api/dto.ts";

export {
  type PaginatedReferralsDto,
  PaginatedReferralsDtoSchema,
  type ReferralDto,
  ReferralDtoSchema,
} from "@/features/referrals/api/referralResourceDto.ts";

const PaginationMetaDtoSchema = z.object({
  current_page: z.number(),
  last_page: z.number(),
  total: z.number(),
  per_page: z.number(),
  from: z.number().nullable(),
  to: z.number().nullable(),
});

// Same shape as billing's BalanceTransactionResource, but scoped to a referral
// instead of a staff member — user is always null, referral is always filled
// (a full nested ReferralResource, same pattern as the "user" field elsewhere;
// we don't need it here since the page is already scoped by referralId).
export const ReferralTransactionDtoSchema = OrderTransactionDtoSchema.extend({
  order_id: z.number().nullable(),
  order_number: z.string().nullable(),
  order_service_id: z.number().nullable().optional(),
  order_product_id: z.number().nullable().optional(),
  order_service: OrderServiceSchema.nullable(),
  order_product: OrderProductSchema.nullable(),
  created_by: UserDtoSchema.nullable(),
  quick_order_id: z.number().nullable(),
  quick_order_number: z.string().nullable(),
});
export type ReferralTransactionDto = z.infer<
  typeof ReferralTransactionDtoSchema
>;

export const PaginatedReferralTransactionsDtoSchema = z.object({
  data: z.array(ReferralTransactionDtoSchema),
  meta: PaginationMetaDtoSchema,
});
export type PaginatedReferralTransactionsDto = z.infer<
  typeof PaginatedReferralTransactionsDtoSchema
>;

import { z } from "zod";

import { CustomerDtoSchema } from "@/features/customers/api/dto.ts";
import { UserDtoSchema } from "@/features/users/api/dto.ts";

// Split out from dto.ts so orders/api/dto.ts can embed ReferralDtoSchema
// (OrderResource.referral) without a circular import: dto.ts also depends on
// orders' schemas for ReferralTransactionDtoSchema, but this file doesn't.
export const ReferralDtoSchema = z.object({
  id: z.number(),
  customer: CustomerDtoSchema,
  commission_percent: z.number(),
  balance: z.string(),
  pending_balance: z.string(),
  created_by: UserDtoSchema.nullable(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});
export type ReferralDto = z.infer<typeof ReferralDtoSchema>;

export const PaginatedReferralsDtoSchema = z.object({
  data: z.array(ReferralDtoSchema),
  meta: z.object({
    current_page: z.number(),
    last_page: z.number(),
    total: z.number(),
    per_page: z.number(),
    from: z.number().nullable(),
    to: z.number().nullable(),
  }),
});
export type PaginatedReferralsDto = z.infer<typeof PaginatedReferralsDtoSchema>;

import { z } from "zod";

import {
  OrderProductSchema,
  OrderServiceSchema,
  OrderTransactionDtoSchema,
} from "@/features/orders/api/dto.ts";
import { UserDtoSchema } from "@/features/users/api/dto.ts";

export const TransactionDtoSchema = OrderTransactionDtoSchema.extend({
  // Unlike order-embedded transactions (always tied to the current order),
  // billing's manual/system transactions have no order at all.
  order_id: z.number().nullable(),
  order_number: z.string().nullable(),
  // Billing's transaction resource sends the nested order_service/order_product
  // (or null) instead of the *_id variants used on order-embedded transactions.
  order_service_id: z.number().nullable().optional(),
  order_product_id: z.number().nullable().optional(),
  order_service: OrderServiceSchema.nullable(),
  order_product: OrderProductSchema.nullable(),
  created_by: UserDtoSchema.nullable(),
  // Present instead of order_id/order_number when the transaction belongs to
  // a quick sale (quick-orders module) rather than a repair order.
  quick_order_id: z.number().nullable(),
  quick_order_number: z.string().nullable(),
});
export type TransactionDto = z.infer<typeof TransactionDtoSchema>;

const PaginationMetaDtoSchema = z.object({
  current_page: z.number(),
  last_page: z.number(),
  total: z.number(),
  per_page: z.number(),
  from: z.number().nullable(),
  to: z.number().nullable(),
});

export const PaginatedTransactionsDtoSchema = z.object({
  data: z.array(TransactionDtoSchema),
  meta: PaginationMetaDtoSchema,
});
export type PaginatedTransactionsDto = z.infer<
  typeof PaginatedTransactionsDtoSchema
>;

export const BalanceDtoSchema = z.object({
  amount: z.string(),
  pending_amount: z.string(),
  id: z.number(),
  user: UserDtoSchema,
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});
export type BalanceDto = z.infer<typeof BalanceDtoSchema>;

export const PaginatedBalancesDtoSchema = z.object({
  data: z.array(BalanceDtoSchema),
  meta: PaginationMetaDtoSchema,
});
export type PaginatedBalancesDto = z.infer<typeof PaginatedBalancesDtoSchema>;

export const SystemBalanceDtoSchema = z.object({ amount: z.string() });
export type SystemBalanceDto = z.infer<typeof SystemBalanceDtoSchema>;

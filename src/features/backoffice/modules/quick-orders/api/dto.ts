import { z } from "zod";

import { TransactionDtoSchema } from "@/features/backoffice/modules/billing/api/dto.ts";
import { LocationDtoSchema } from "@/features/backoffice/modules/dictionaries/api/dto.ts";
import {
  OrderProductSchema,
  OrderServiceSchema,
} from "@/features/backoffice/modules/orders/api/dto.ts";
import { UserDtoSchema } from "@/features/backoffice/modules/users/api/dto.ts";
import { zodEnumFromConst } from "@/shared/lib/zod-helpers.ts";
import { PAYMENT_METHODS } from "@/shared/types.ts";

export const QuickOrderDtoSchema = z.object({
  id: z.number(),
  number: z.string(),
  manager: UserDtoSchema,
  location: LocationDtoSchema.nullable(),
  payment_method: zodEnumFromConst(PAYMENT_METHODS).nullable(),
  total_price: z.string(),
  total_cost: z.string(),
  total_income: z.string(),
  created_at: z.iso.datetime(),
});
export type QuickOrderDto = z.infer<typeof QuickOrderDtoSchema>;

export const PaginatedQuickOrdersDtoSchema = z.object({
  data: z.array(QuickOrderDtoSchema),
  meta: z.object({
    current_page: z.number(),
    last_page: z.number(),
    total: z.number(),
    per_page: z.number(),
    from: z.number().nullable(),
    to: z.number().nullable(),
  }),
});
export type PaginatedQuickOrdersDto = z.infer<
  typeof PaginatedQuickOrdersDtoSchema
>;

export const QuickOrderDetailDtoSchema = QuickOrderDtoSchema.extend({
  created_by: UserDtoSchema.nullable(),
  comment: z.string().nullable(),
  services: z.array(OrderServiceSchema),
  products: z.array(OrderProductSchema),
  transactions: z.array(TransactionDtoSchema),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable(),
});
export type QuickOrderDetailDto = z.infer<typeof QuickOrderDetailDtoSchema>;

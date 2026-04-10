import { z } from "zod";

import { CustomerDtoSchema } from "@/features/backoffice/modules/customers/api/dto.ts";
import { UserDtoSchema } from "@/features/backoffice/modules/users/api/dto.ts";

export const StatusDtoSchema = z.object({
  id: z.number(),
  key: z.string(),
  name_ru: z.string(),
  name_ua: z.string(),
  color: z.string(),
  is_system: z.boolean(),
});
export type StatusDto = z.infer<typeof StatusDtoSchema>;

export const StatusHistoryItemDtoSchema = z.object({
  id: z.number(),
  status: StatusDtoSchema,
  changed_by_user: UserDtoSchema,
  created_at: z.string(),
});
export type StatusHistoryItemDto = z.infer<typeof StatusHistoryItemDtoSchema>;

export const OrderDtoSchema = z.object({
  id: z.number(),
  order_number: z.string().trim().min(1),
  customer: CustomerDtoSchema,
  manager: UserDtoSchema,
  assignee: UserDtoSchema.nullable(),
  status: StatusDtoSchema,
  issue_type: z.string().trim().min(1),
  device_type: z.string().trim().min(1),
  manufacturer: z.string().trim().min(1),
  device_model: z.string().trim().min(1),
  device_condition: z.string().nullable(),
  accessory: z.string().nullable(),
  device_password: z.string().trim().min(1),
  intake_note: z.string().nullable(),
  prepayment: z.string().nullable(),
  due_date: z.iso.datetime(),
  estimated_cost: z.string().nullable(),
  is_urgent: z.boolean(),
  is_called: z.boolean(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  closed_at: z.iso.datetime().nullable(),
  total_cost: z.string().nullable(),
  total_income: z.string().nullable(),
});
export type OrderDto = z.infer<typeof OrderDtoSchema>;

export const PaginatedOrdersDtoSchema = z.object({
  data: z.array(OrderDtoSchema),
  meta: z.object({
    current_page: z.number(),
    last_page: z.number(),
    total: z.number(),
    per_page: z.number(),
    from: z.number().nullable(),
    to: z.number().nullable(),
  }),
});

export type PaginatedOrdersDto = z.infer<typeof PaginatedOrdersDtoSchema>;

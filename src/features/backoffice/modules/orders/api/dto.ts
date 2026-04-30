import { z } from "zod";

import { CustomerDtoSchema } from "@/features/backoffice/modules/customers/api/dto.ts";
import { LocationDtoSchema } from "@/features/backoffice/modules/dictionaries/api/dto.ts";
import { UserDtoSchema } from "@/features/backoffice/modules/users/api/dto.ts";
import { zodEnumFromConst } from "@/shared/lib/zod-helpers.ts";
import { PAYMENTS } from "@/shared/types.ts";

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

export const DocumentsDtoSchema = z.object({
  id: z.number(),
  type: z.string(),
  url: z.string(),
  name: z.string(),
  created_at: z.iso.datetime(),
});
export type DocumentDto = z.infer<typeof DocumentsDtoSchema>;

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
  total_paid: z.string(),
  remaining_to_pay: z.string(),
  due_date: z.iso.datetime(),
  estimated_cost: z.string().nullable(),
  is_urgent: z.boolean(),
  is_called: z.boolean(),
  location: LocationDtoSchema,
  total_cost: z.string(),
  total_income: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  closed_at: z.iso.datetime().nullable(),
  documents: z.array(DocumentsDtoSchema),
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

export const OrderCommentDtoSchema = z.object({
  id: z.number(),
  user: UserDtoSchema,
  body: z.string().nullable(),
  image_url: z.string().nullable(),
  created_at: z.iso.datetime(),
});

export type OrderCommentDto = z.infer<typeof OrderCommentDtoSchema>;

export const OrderProductSchema = z.object({
  id: z.number(),
  manager: UserDtoSchema,
  supplier_name: z.string().nullable().optional(),
  name: z.string(),
  price: z.string(),
  purchase_price: z.string().nullable().optional(),
  quantity: z.number(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable().optional(),
  deleted_by_user: UserDtoSchema.nullable().optional(),
});

export type OrderProductDto = z.infer<typeof OrderProductSchema>;
export const OrderServiceSchema = z.object({
  id: z.number(),
  manager: UserDtoSchema,
  repair_operation_id: z.number().nullable().optional(),
  name: z.string(),
  price: z.string(),
  cost_price: z.string().nullable().optional(),
  quantity: z.number(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable().optional(),
  deleted_by_user: UserDtoSchema.nullable().optional(),
});
export type OrderServiceDto = z.infer<typeof OrderServiceSchema>;

export const OrderPaymentSchema = z.object({
  id: z.number(),
  type: zodEnumFromConst(PAYMENTS),
  amount: z.string(),
  note: z.string().nullable(),
  manager: UserDtoSchema.nullable(),
  created_at: z.iso.datetime(),
});
export type OrderPaymentDto = z.infer<typeof OrderPaymentSchema>;

export const OrderInfoDtoSchema = OrderDtoSchema.extend({
  location: LocationDtoSchema,
  status_history: z.array(StatusHistoryItemDtoSchema),
  services: z.array(OrderServiceSchema),
  products: z.array(OrderProductSchema),
  comments: z.array(OrderCommentDtoSchema),
  payments: z.array(OrderPaymentSchema),
});
export type OrderInfoDto = z.infer<typeof OrderInfoDtoSchema>;

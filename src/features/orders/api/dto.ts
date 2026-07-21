import { z } from "zod";

import { StatusDtoSchema } from "@/entities/order-status/dto";
import {
  CustomerDtoSchema,
  CustomerInfoDtoSchema,
} from "@/features/customers/api/dto.ts";
import {
  LocationDtoSchema,
  OutsourcerDtoSchema,
  SupplierDtoSchema,
} from "@/features/dictionaries/api/dto.ts";
import { ReferralDtoSchema } from "@/features/referrals/api/referralResourceDto.ts";
import { UserDtoSchema } from "@/features/users/api/dto.ts";
import { zodEnumFromConst } from "@/shared/lib/zod-helpers.ts";
import {
  DOCUMENTS_TYPES,
  PAYMENT_METHODS,
  PAYMENTS,
  TRANSACTION_STATUSES,
} from "@/shared/types.ts";
export { type StatusDto, StatusDtoSchema } from "@/entities/order-status/dto";

export const StatusHistoryItemDtoSchema = z.object({
  id: z.number(),
  status: StatusDtoSchema,
  changed_by_user: UserDtoSchema,
  created_at: z.iso.datetime(),
});
export type StatusHistoryItemDto = z.infer<typeof StatusHistoryItemDtoSchema>;

export const DocumentsDtoSchema = z.object({
  id: z.number(),
  type: z.enum(DOCUMENTS_TYPES),
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
  referral: ReferralDtoSchema.nullable(),
  total_cost: z.string(),
  total_income: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  closed_at: z.iso.datetime().nullable(),
  ready_sms_sent_at: z.iso.datetime().nullable().optional(),
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
  created_by_user: UserDtoSchema.nullable(),
  supplier: SupplierDtoSchema.nullable().optional(),
  name: z.string(),
  price: z.string(),
  purchase_price: z.string().nullable().optional(),
  quantity: z.number(),
  completed_at: z.iso.datetime().nullable(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable().optional(),
  deleted_by_user: UserDtoSchema.nullable(),
});

export type OrderProductDto = z.infer<typeof OrderProductSchema>;
export const OrderServiceSchema = z.object({
  id: z.number(),
  manager: UserDtoSchema,
  created_by_user: UserDtoSchema.nullable(),
  repair_operation_id: z.number().nullable().optional(),
  name: z.string(),
  price: z.string(),
  cost_price: z.string().nullable().optional(),
  outsourcer: OutsourcerDtoSchema.nullable().optional(),
  quantity: z.number(),
  created_at: z.iso.datetime(),
  completed_at: z.iso.datetime().nullable(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable().optional(),
  deleted_by_user: UserDtoSchema.nullable(),
});
export type OrderServiceDto = z.infer<typeof OrderServiceSchema>;

export const OrderPaymentSchema = z.object({
  id: z.number(),
  type: zodEnumFromConst(PAYMENTS),
  method: zodEnumFromConst(PAYMENT_METHODS),
  amount: z.string(),
  note: z.string().nullable(),
  manager: UserDtoSchema,
  created_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable(),
  deleted_by_user: UserDtoSchema.nullable(),
});
export type OrderPaymentDto = z.infer<typeof OrderPaymentSchema>;

export const CallHistoryDtoSchema = z.object({
  id: z.number(),
  is_called: z.boolean(),
  changed_by_user: UserDtoSchema.nullable(),
  created_at: z.iso.datetime(),
});

export type CallHistoryDto = z.infer<typeof CallHistoryDtoSchema>;
export const OrderTransactionDtoSchema = z.object({
  id: z.number(),
  amount: z.string(),
  type: z.string(),
  label: z.string(),
  status: zodEnumFromConst(TRANSACTION_STATUSES),
  user: UserDtoSchema.nullable(),
  referral: ReferralDtoSchema.nullable(),
  order_id: z.number(),
  order_number: z.string(),
  order_service_id: z.number().nullable().optional(),
  order_product_id: z.number().nullable().optional(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});
export type OrderTransactionDto = z.infer<typeof OrderTransactionDtoSchema>;

export const OrderInfoDtoSchema = OrderDtoSchema.extend({
  customer: CustomerInfoDtoSchema,
  location: LocationDtoSchema,
  status_history: z.array(StatusHistoryItemDtoSchema),
  services: z.array(OrderServiceSchema),
  products: z.array(OrderProductSchema),
  comments: z.array(OrderCommentDtoSchema),
  payments: z.array(OrderPaymentSchema),
  call_history: z.array(CallHistoryDtoSchema),
  transactions: z.array(OrderTransactionDtoSchema),
});
export type OrderInfoDto = z.infer<typeof OrderInfoDtoSchema>;

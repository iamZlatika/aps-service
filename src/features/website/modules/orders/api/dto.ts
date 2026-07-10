import { z } from "zod";

import { LocationDtoSchema } from "@/entities/location/dto";
import { StatusDtoSchema } from "@/entities/order-status/dto";
import { TrackPaymentDtoSchema } from "@/features/website/api/dto";
import { DOCUMENTS_TYPES } from "@/shared/types";

export const OrderListItemDtoSchema = z.object({
  id: z.number(),
  order_number: z.string(),
  status: StatusDtoSchema,
  device_type: z.string(),
  manufacturer: z.string(),
  device_model: z.string(),
  is_urgent: z.boolean(),
  estimated_cost: z.string().nullable(),
  total_paid: z.string(),
  remaining_to_pay: z.string(),
  due_date: z.iso.datetime(),
  closed_at: z.iso.datetime().nullable(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});
export type OrderListItemDto = z.infer<typeof OrderListItemDtoSchema>;

export const PaginatedOrdersDtoSchema = z.object({
  data: z.array(OrderListItemDtoSchema),
  meta: z.object({
    current_page: z.number(),
    last_page: z.number(),
    total: z.number(),
    per_page: z.number(),
  }),
});
export type PaginatedOrdersDto = z.infer<typeof PaginatedOrdersDtoSchema>;

export const OrderDocumentDtoSchema = z.object({
  id: z.number(),
  type: z.enum(DOCUMENTS_TYPES),
  name: z.string(),
  created_at: z.iso.datetime(),
  download_url: z.string(),
});
export type OrderDocumentDto = z.infer<typeof OrderDocumentDtoSchema>;

export const OrderLineItemDtoSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  price: z.string(),
  sum: z.string(),
});
export type OrderLineItemDto = z.infer<typeof OrderLineItemDtoSchema>;

export const OrderDetailDtoSchema = OrderListItemDtoSchema.extend({
  issue_type: z.string(),
  device_condition: z.string().nullable(),
  accessory: z.string().nullable(),
  location: LocationDtoSchema,
  payments: z.array(TrackPaymentDtoSchema),
  services: z.array(OrderLineItemDtoSchema),
  products: z.array(OrderLineItemDtoSchema),
  documents: z.array(OrderDocumentDtoSchema),
  total_cost: z.string().nullable(),
});
export type OrderDetailDto = z.infer<typeof OrderDetailDtoSchema>;

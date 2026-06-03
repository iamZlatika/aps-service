import { z } from "zod";

import { LocationDtoSchema } from "@/entities/location/dto";
import { StatusDtoSchema } from "@/entities/order-status/dto";
import { PriceListItemDtoSchema } from "@/entities/price-list/dto";
import { zodEnumFromConst } from "@/shared/lib/zod-helpers";
import { PAYMENT_METHODS, PAYMENTS } from "@/shared/types";

export { type StatusDto, StatusDtoSchema } from "@/entities/order-status/dto";

export const LocationsResponseDtoSchema = z.object({
  data: z.array(LocationDtoSchema),
});
export type LocationsResponseDto = z.infer<typeof LocationsResponseDtoSchema>;

export const DaySlotDtoSchema = z.object({
  from: z.string(),
  to: z.string(),
});
export type DaySlotDto = z.infer<typeof DaySlotDtoSchema>;

export const TrackStatusHistoryItemDtoSchema = z.object({
  status: StatusDtoSchema,
  created_at: z.string(),
});
export type TrackStatusHistoryItemDto = z.infer<
  typeof TrackStatusHistoryItemDtoSchema
>;

export const TrackProductDtoSchema = z.object({
  name: z.string(),
  price: z.string(),
  sum: z.string(),
  quantity: z.number(),
  created_at: z.iso.datetime(),
  completed_at: z.iso.datetime().nullable(),
  deleted_at: z.iso.datetime().nullable(),
});
export type TrackProductDto = z.infer<typeof TrackProductDtoSchema>;

export const TrackServiceDtoSchema = z.object({
  name: z.string(),
  price: z.string(),
  sum: z.string(),
  quantity: z.number(),
  created_at: z.iso.datetime(),
  completed_at: z.iso.datetime().nullable(),
  deleted_at: z.iso.datetime().nullable(),
});
export type TrackServiceDto = z.infer<typeof TrackServiceDtoSchema>;

export const TrackPaymentDtoSchema = z.object({
  type: zodEnumFromConst(PAYMENTS),
  method: zodEnumFromConst(PAYMENT_METHODS),
  amount: z.string(),
  created_at: z.iso.datetime(),
});
export type TrackPaymentDto = z.infer<typeof TrackPaymentDtoSchema>;

export const TrackDtoSchema = z.object({
  order_number: z.string(),
  status: StatusDtoSchema,
  device_type: z.string(),
  manufacturer: z.string(),
  device_model: z.string(),
  device_condition: z.string().nullable(),
  accessory: z.string().nullable(),
  issue_type: z.string(),
  intake_note: z.string().nullable(),
  estimated_cost: z.string().nullable(),
  total_paid: z.string(),
  due_date: z.string(),
  is_called: z.boolean(),
  is_urgent: z.boolean(),
  created_at: z.string(),
  status_history: z.array(TrackStatusHistoryItemDtoSchema),
  products: z.array(TrackProductDtoSchema),
  services: z.array(TrackServiceDtoSchema),
  payments: z.array(TrackPaymentDtoSchema),
});
export type TrackDto = z.infer<typeof TrackDtoSchema>;

export const OrderPreviewDtoSchema = TrackDtoSchema.pick({
  order_number: true,
  status: true,
  manufacturer: true,
  device_type: true,
  device_model: true,
  issue_type: true,
});
export type OrderPreviewDto = z.infer<typeof OrderPreviewDtoSchema>;

export const ActiveCountDtoSchema = z.object({
  count: z.number(),
});
export type ActiveCountDto = z.infer<typeof ActiveCountDtoSchema>;

export const PriceListResponseDtoSchema = z.object({
  data: z.array(PriceListItemDtoSchema),
});

import { z } from "zod";

import { WEEK_DAYS, type WeekDay } from "@/shared/types";

export const DaySlotDtoSchema = z.object({
  from: z.string(),
  to: z.string(),
});
export type DaySlotDto = z.infer<typeof DaySlotDtoSchema>;

export const ScheduleDtoSchema = z.object(
  WEEK_DAYS.reduce(
    (acc, day) => ({ ...acc, [day]: DaySlotDtoSchema.nullable() }),
    {} as Record<WeekDay, z.ZodNullable<typeof DaySlotDtoSchema>>,
  ),
);
export type ScheduleDto = z.infer<typeof ScheduleDtoSchema>;

export const LocationDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  city_ru: z.string(),
  city_ua: z.string(),
  district_ru: z.string(),
  district_ua: z.string(),
  street_ru: z.string(),
  street_ua: z.string(),
  building: z.string(),
  address_ru: z.string(),
  address_ua: z.string(),
  phone: z.string(),
  schedule: ScheduleDtoSchema,
  schedule_display: z.string(),
});
export type LocationDto = z.infer<typeof LocationDtoSchema>;

export const LocationsResponseDtoSchema = z.object({
  data: z.array(LocationDtoSchema),
});
export type LocationsResponseDto = z.infer<typeof LocationsResponseDtoSchema>;

export const StatusDtoSchema = z.object({
  id: z.number(),
  key: z.string(),
  name_ru: z.string(),
  name_ua: z.string(),
  color: z.string(),
  is_system: z.boolean(),
});
export type StatusDto = z.infer<typeof StatusDtoSchema>;

export const TrackStatusHistoryItemDtoSchema = z.object({
  status: StatusDtoSchema,
  created_at: z.string(),
});
export type TrackStatusHistoryItemDto = z.infer<
  typeof TrackStatusHistoryItemDtoSchema
>;

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
});
export type TrackDto = z.infer<typeof TrackDtoSchema>;

export const OrderPreviewDtoSchema = TrackDtoSchema.pick({
  order_number: true,
  status: true,
  manufacturer: true,
  device_type: true,
  device_model: true,
  issue_type: true,
  status_history: true,
});
export type OrderPreviewDto = z.infer<typeof OrderPreviewDtoSchema>;

export const ActiveCountDtoSchema = z.object({
  count: z.number(),
});
export type ActiveCountDto = z.infer<typeof ActiveCountDtoSchema>;

import { z } from "zod";

const ScheduleDayDtoSchema = z
  .object({ from: z.string(), to: z.string() })
  .nullable();

const LocationScheduleDtoSchema = z.object({
  mon: ScheduleDayDtoSchema,
  tue: ScheduleDayDtoSchema,
  wed: ScheduleDayDtoSchema,
  thu: ScheduleDayDtoSchema,
  fri: ScheduleDayDtoSchema,
  sat: ScheduleDayDtoSchema,
  sun: ScheduleDayDtoSchema,
});

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
  schedule: LocationScheduleDtoSchema,
  schedule_display: z.string(),
});

export type LocationDto = z.infer<typeof LocationDtoSchema>;

import i18next from "i18next";
import { z } from "zod";

import { WEEK_DAYS } from "@/shared/types";

export const ScheduleGroupSchema = z
  .object({
    fromDay: z.enum(WEEK_DAYS),
    toDay: z.enum(WEEK_DAYS),
    from: z
      .string()
      .regex(/^\d{2}:\d{2}$/, i18next.t("validation.field_required")),
    to: z
      .string()
      .regex(/^\d{2}:\d{2}$/, i18next.t("validation.field_required")),
  })
  .refine((v) => v.to > v.from, {
    message: i18next.t("validation.time_end_before_start"),
    path: ["to"],
  });

const requiredString = () =>
  z.string().min(1, i18next.t("validation.field_required"));

export const LocationFormSchema = z.object({
  name: requiredString(),
  city_ru: requiredString(),
  city_ua: requiredString(),
  district_ru: requiredString(),
  district_ua: requiredString(),
  street_ru: requiredString(),
  street_ua: requiredString(),
  building: requiredString(),
  phone: requiredString(),
  scheduleGroups: z.array(ScheduleGroupSchema),
});

export type LocationFormValues = z.infer<typeof LocationFormSchema>;

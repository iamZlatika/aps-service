import i18next from "i18next";
import { z } from "zod";

import { WEEK_DAYS } from "@/features/backoffice/modules/dictionaries/types.ts";

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

export const LocationFormSchema = z.object({
  name: z.string().min(1, i18next.t("validation.field_required")),
  address: z.string().min(1, i18next.t("validation.field_required")),
  phone: z.string().min(1, i18next.t("validation.field_required")),
  scheduleGroups: z.array(ScheduleGroupSchema),
});

export type LocationFormValues = z.infer<typeof LocationFormSchema>;

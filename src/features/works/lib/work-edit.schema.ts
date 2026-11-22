import i18next from "i18next";
import { z } from "zod";

import { WORK_TYPES, type WorkType } from "@/entities/work/types";
import { addMissingReasonIssues } from "@/features/works/lib/work.schema";

const requiredString = () =>
  z.string().trim().min(1, i18next.t("validation.field_required"));

/** The type can't be changed on edit, so it only switches the reason rule. */
export const workEditSchema = (type: WorkType | undefined) =>
  z
    .object({
      device_type: requiredString(),
      manufacturer: requiredString(),
      device_model: requiredString(),
      description_ru: requiredString(),
      description_uk: requiredString(),
      reason_ru: z.string().optional(),
      reason_uk: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (type === WORK_TYPES.REPAIR) addMissingReasonIssues(data, ctx);
    });

export type WorkEditFormValues = z.infer<ReturnType<typeof workEditSchema>>;

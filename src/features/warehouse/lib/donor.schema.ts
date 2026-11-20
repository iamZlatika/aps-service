import i18next from "i18next";
import { z } from "zod";

import {
  dictionaryRefField,
  isDictionaryRefFilled,
  optionalDigitsField,
} from "@/features/warehouse/lib/fieldSchemas.ts";

export const donorSchema = () =>
  z
    .object({
      manufacturer: z.string().trim(),
      deviceType: z.string().trim(),
      deviceModel: z.string().trim(),
      origin: z.string().trim().max(255),
      acquisitionCost: optionalDigitsField(),
      storagePlace: dictionaryRefField(),
      saveStoragePlace: z.boolean(),
      locationId: z
        .number({ error: i18next.t("validation.locationRequired") })
        .int()
        .positive(),
      note: z.string().trim(),
    })
    .superRefine((values, ctx) => {
      if (!isDictionaryRefFilled(values.storagePlace)) {
        ctx.addIssue({
          code: "custom",
          path: ["storagePlace"],
          message: i18next.t("validation.field_required"),
        });
      }
    });

export type DonorFormValues = z.input<ReturnType<typeof donorSchema>>;
export type DonorSchema = z.infer<ReturnType<typeof donorSchema>>;

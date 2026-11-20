import i18next from "i18next";
import { z } from "zod";

import {
  dictionaryRefField,
  isDictionaryRefFilled,
  optionalDigitsField,
} from "@/features/warehouse/lib/fieldSchemas.ts";

export const donorPartSchema = () =>
  z
    .object({
      category: dictionaryRefField(),
      name: z.string().trim(),
      costPrice: optionalDigitsField(),
      storagePlace: dictionaryRefField(),
      saveStoragePlace: z.boolean(),
      locationId: z
        .number({ error: i18next.t("validation.locationRequired") })
        .int()
        .positive(),
      note: z.string().trim(),
    })
    .superRefine((values, ctx) => {
      if (!isDictionaryRefFilled(values.category)) {
        ctx.addIssue({
          code: "custom",
          path: ["category"],
          message: i18next.t("validation.field_required"),
        });
      }
      if (!isDictionaryRefFilled(values.storagePlace)) {
        ctx.addIssue({
          code: "custom",
          path: ["storagePlace"],
          message: i18next.t("validation.field_required"),
        });
      }
    });

export type DonorPartFormValues = z.input<ReturnType<typeof donorPartSchema>>;
export type DonorPartSchema = z.infer<ReturnType<typeof donorPartSchema>>;

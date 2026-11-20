import i18next from "i18next";
import { z } from "zod";

import {
  dictionaryRefField,
  isDictionaryRefFilled,
  optionalDigitsField,
  requiredDigitsField,
} from "@/features/warehouse/lib/fieldSchemas.ts";

const requiredStoragePlace = () =>
  dictionaryRefField().refine(isDictionaryRefFilled, {
    message: i18next.t("validation.field_required"),
  });

/** Order → "To donors": only where to put the new donor. */
export const toDonorSchema = () =>
  z.object({ storagePlace: requiredStoragePlace() });

export type ToDonorFormValues = z.input<ReturnType<typeof toDonorSchema>>;
export type ToDonorSchema = z.infer<ReturnType<typeof toDonorSchema>>;

/** A required id picked in a combobox (null until something is picked). */
const pickedIdField = () =>
  z
    .number()
    .int()
    .positive()
    .nullable()
    .transform((value, ctx) => {
      if (value === null) {
        ctx.addIssue({
          code: "custom",
          message: i18next.t("validation.field_required"),
        });
        return z.NEVER;
      }
      return value;
    });

/**
 * A picked part must have a cost price (on its card or typed here): the
 * line's purchase is their sum, and the master's percent comes from margin.
 */
const donorSalePartSchema = () =>
  z
    .object({
      id: z.number().int().positive(),
      label: z.string(),
      selected: z.boolean(),
      costPrice: optionalDigitsField(),
      cardCostPrice: z.string().nullable(),
    })
    .superRefine((part, ctx) => {
      if (part.selected && !part.costPrice) {
        ctx.addIssue({
          code: "custom",
          path: ["costPrice"],
          message: i18next.t("validation.field_required"),
        });
      }
    });

/**
 * "Sell donor" — the same in an order and in a quick sale: which donor, which
 * of its parts go with it (none = all), and the price. The name comes from the
 * donor card; the purchase is computed by the backend.
 */
export const donorSaleSchema = () =>
  z.object({
    donorId: pickedIdField(),
    donorLabel: z.string(),
    parts: z.array(donorSalePartSchema()),
    price: requiredDigitsField(),
  });

export type DonorSaleFormValues = z.input<ReturnType<typeof donorSaleSchema>>;
export type DonorSaleSchema = z.infer<ReturnType<typeof donorSaleSchema>>;

/** Order → "Sell donor": a donor line also needs its manager. */
export const sellDonorSchema = () =>
  donorSaleSchema().extend({
    managerId: z
      .number({ error: i18next.t("validation.field_required") })
      .int()
      .positive(),
  });

export type SellDonorFormValues = z.input<ReturnType<typeof sellDonorSchema>>;
export type SellDonorSchema = z.infer<ReturnType<typeof sellDonorSchema>>;

import i18next from "i18next";
import { z } from "zod";

import {
  optionalDigitsField,
  requiredDigitsField,
} from "@/features/warehouse/lib/fieldSchemas.ts";

/**
 * A line sold from the warehouse: the price is always the seller's (the card
 * price is only a default), the name and purchase price come from the card.
 * A donor part's cost price is prefilled from the card and overwrites it when
 * changed.
 */
export const warehouseLineSchema = () =>
  z.object({
    price: requiredDigitsField(),
    quantity: z
      .string()
      .trim()
      .min(1, i18next.t("validation.field_required"))
      .regex(/^\d+$/, i18next.t("validation.digitsOnly"))
      .transform(Number)
      .refine((value) => value >= 1, {
        message: i18next.t("validation.minQuantity"),
      }),
    costPrice: optionalDigitsField(),
  });

export type WarehouseLineFormValues = z.input<
  ReturnType<typeof warehouseLineSchema>
>;
export type WarehouseLineSchema = z.infer<
  ReturnType<typeof warehouseLineSchema>
>;

import i18next from "i18next";
import { z } from "zod";

import { optionalDigitsField } from "@/features/warehouse/lib/fieldSchemas.ts";
import { MANUAL_STOCK_REASONS } from "@/features/warehouse/types.ts";
import { zodEnumFromConst } from "@/shared/lib/zod-helpers.ts";

export const stockMovementSchema = () =>
  z
    .object({
      reason: zodEnumFromConst(MANUAL_STOCK_REASONS),
      locationId: z
        .number({ error: i18next.t("validation.locationRequired") })
        .int()
        .positive(),
      quantity: z
        .string()
        .trim()
        .min(1, i18next.t("validation.field_required"))
        .regex(/^[+-]?\d+$/, i18next.t("validation.digitsOnly"))
        .transform(Number)
        .refine((value) => value !== 0, {
          message: i18next.t("warehouse.stock.nonZero"),
        }),
      note: z.string().trim().max(500),
      purchasePrice: optionalDigitsField(),
    })
    .superRefine((values, ctx) => {
      // A correction means "accounting drifted from reality" — say why. The
      // backend doesn't require it; the form does.
      if (values.reason === MANUAL_STOCK_REASONS.CORRECTION && !values.note) {
        ctx.addIssue({
          code: "custom",
          path: ["note"],
          message: i18next.t("validation.field_required"),
        });
      }
    });

export type StockMovementFormValues = z.input<
  ReturnType<typeof stockMovementSchema>
>;
export type StockMovementSchema = z.infer<
  ReturnType<typeof stockMovementSchema>
>;

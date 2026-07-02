import i18next from "i18next";
import { z } from "zod";

import { BILLING_DIRECTIONS } from "@/features/backoffice/modules/billing/lib/constants.ts";
import { zodEnumFromConst } from "@/shared/lib/zod-helpers.ts";

export const adjustBalanceSchema = () =>
  z.object({
    userId: z.number().int().positive(),
    direction: zodEnumFromConst(BILLING_DIRECTIONS),
    amount: z
      .string()
      .trim()
      .min(1, i18next.t("validation.field_required"))
      .refine(
        (v) => /^\d+(\.\d{1,2})?$/.test(v) && Number.parseFloat(v) > 0,
        i18next.t("validation.positive_amount"),
      ),
    description: z
      .string()
      .trim()
      .min(1, i18next.t("validation.field_required"))
      .max(255, i18next.t("validation.description_max", { count: 255 })),
  });

export type AdjustBalanceSchema = z.infer<
  ReturnType<typeof adjustBalanceSchema>
>;
export type AdjustBalanceFormValues = z.input<
  ReturnType<typeof adjustBalanceSchema>
>;

import i18next from "i18next";
import { z } from "zod";

import {
  optionalDigitsField,
  requiredDigitsField,
} from "@/features/warehouse/lib/fieldSchemas.ts";

export const INVESTMENT_MODES = {
  WAREHOUSE: "warehouse",
  FREE: "free",
} as const;
export type InvestmentMode =
  (typeof INVESTMENT_MODES)[keyof typeof INVESTMENT_MODES];

/**
 * A warehouse item (its stock is written off, the amount defaults to purchase
 * × quantity) or a free line — name + amount (delivery, own paste, …).
 */
export const donorInvestmentSchema = () =>
  z
    .object({
      mode: z.enum([INVESTMENT_MODES.WAREHOUSE, INVESTMENT_MODES.FREE]),
      itemId: z.number().int().positive().nullable(),
      itemLabel: z.string(),
      quantity: optionalDigitsField(),
      name: z.string().trim().max(255),
      amount: optionalDigitsField(),
      note: z.string().trim().max(500),
    })
    .superRefine((values, ctx) => {
      const required = (path: string) =>
        ctx.addIssue({
          code: "custom",
          path: [path],
          message: i18next.t("validation.field_required"),
        });
      if (values.mode === INVESTMENT_MODES.WAREHOUSE) {
        if (values.itemId === null) required("itemId");
        if (!Number(values.quantity)) required("quantity");
        return;
      }
      if (!values.name) required("name");
      if (!requiredDigitsField().safeParse(values.amount).success) {
        required("amount");
      }
    });

export type DonorInvestmentFormValues = z.input<
  ReturnType<typeof donorInvestmentSchema>
>;
export type DonorInvestmentSchema = z.infer<
  ReturnType<typeof donorInvestmentSchema>
>;

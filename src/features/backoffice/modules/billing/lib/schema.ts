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

export const requestWithdrawalSchema = (available: string) =>
  z.object({
    amount: z
      .string()
      .trim()
      .min(1, i18next.t("validation.field_required"))
      .refine(
        (v) => /^\d+(\.\d{1,2})?$/.test(v) && Number.parseFloat(v) > 0,
        i18next.t("validation.positive_amount"),
      )
      .refine(
        (v) => Number.parseFloat(v) <= Number.parseFloat(available),
        i18next.t("validation.amount_exceeds_available"),
      ),
    description: z
      .string()
      .trim()
      .max(255, i18next.t("validation.description_max", { count: 255 }))
      .optional(),
  });

export type RequestWithdrawalSchema = z.infer<
  ReturnType<typeof requestWithdrawalSchema>
>;
export type RequestWithdrawalFormValues = z.input<
  ReturnType<typeof requestWithdrawalSchema>
>;

export const adjustSystemBalanceSchema = () =>
  z.object({
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

export type AdjustSystemBalanceSchema = z.infer<
  ReturnType<typeof adjustSystemBalanceSchema>
>;
export type AdjustSystemBalanceFormValues = z.input<
  ReturnType<typeof adjustSystemBalanceSchema>
>;

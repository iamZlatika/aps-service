import i18next from "i18next";
import { z } from "zod";

import { REFERRAL_DIRECTIONS } from "@/features/backoffice/modules/referrals/lib/constants.ts";
import { zodEnumFromConst } from "@/shared/lib/zod-helpers.ts";

export const makeReferralSchema = () =>
  z.object({
    customerId: z
      .number()
      .int()
      .positive({
        error: i18next.t("validation.field_required"),
      }),
    commissionPercent: z.coerce
      .number({ error: i18next.t("validation.field_required") })
      .min(0, i18next.t("validation.field_required"))
      .max(100, i18next.t("validation.field_required")),
  });

export type MakeReferralSchema = z.infer<ReturnType<typeof makeReferralSchema>>;
export type MakeReferralFormValues = z.input<
  ReturnType<typeof makeReferralSchema>
>;

export const editReferralSchema = () =>
  z.object({
    commissionPercent: z.coerce
      .number({ error: i18next.t("validation.field_required") })
      .min(0, i18next.t("validation.field_required"))
      .max(100, i18next.t("validation.field_required")),
  });

export type EditReferralSchema = z.infer<ReturnType<typeof editReferralSchema>>;
export type EditReferralFormValues = z.input<
  ReturnType<typeof editReferralSchema>
>;

export const adjustReferralBalanceSchema = () =>
  z.object({
    direction: zodEnumFromConst(REFERRAL_DIRECTIONS),
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

export type AdjustReferralBalanceSchema = z.infer<
  ReturnType<typeof adjustReferralBalanceSchema>
>;
export type AdjustReferralBalanceFormValues = z.input<
  ReturnType<typeof adjustReferralBalanceSchema>
>;

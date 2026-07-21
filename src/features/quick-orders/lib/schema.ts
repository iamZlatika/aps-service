import i18next from "i18next";
import { z } from "zod";

import { zodEnumFromConst } from "@/shared/lib/zod-helpers.ts";
import { PAYMENT_METHODS } from "@/shared/types.ts";

export const newQuickOrderItemSchema = () =>
  z.object({
    name: z.string().trim().min(1, i18next.t("validation.field_required")),
    price: z
      .string()
      .trim()
      .min(1, i18next.t("validation.field_required"))
      .regex(/^\d+$/, i18next.t("validation.digitsOnly")),
    quantity: z
      .number({ error: i18next.t("validation.field_required") })
      .int()
      .min(1, i18next.t("validation.minQuantity")),
    costPrice: z
      .string()
      .optional()
      .default("")
      .refine((value) => !value || /^\d+$/.test(value), {
        message: i18next.t("validation.digitsOnly"),
      }),
    purchasePrice: z
      .string()
      .optional()
      .default("")
      .refine((value) => !value || /^\d+$/.test(value), {
        message: i18next.t("validation.digitsOnly"),
      }),
  });
export type NewQuickOrderItemSchema = z.infer<
  ReturnType<typeof newQuickOrderItemSchema>
>;
export type NewQuickOrderItemFormValues = z.input<
  ReturnType<typeof newQuickOrderItemSchema>
>;

export const newQuickOrderSchema = () =>
  z.object({
    managerId: z.number().int().positive().optional(),
    locationId: z
      .number({ error: i18next.t("validation.locationRequired") })
      .int()
      .positive(),
    paymentMethod: zodEnumFromConst(PAYMENT_METHODS).optional(),
    comment: z.string().max(2048).optional(),
    services: z.array(newQuickOrderItemSchema()),
    products: z.array(newQuickOrderItemSchema()),
  });
export type NewQuickOrderSchema = z.infer<
  ReturnType<typeof newQuickOrderSchema>
>;
export type NewQuickOrderFormValues = z.input<
  ReturnType<typeof newQuickOrderSchema>
>;

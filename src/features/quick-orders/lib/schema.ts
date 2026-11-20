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
    // Set when the product was picked from the warehouse; the name is then
    // only for display — the backend takes it from the card.
    warehouseItemId: z.number().int().positive().nullable().default(null),
    donorPartId: z.number().int().positive().nullable().default(null),
    // A whole donor (quantity 1) and the parts sold with it — none = all.
    warehouseDonorId: z.number().int().positive().nullable().default(null),
    donorParts: z
      .array(
        z.object({
          id: z.number().int().positive(),
          costPrice: z.string().nullable(),
        }),
      )
      .default([]),
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
    paymentMethod: zodEnumFromConst(
      PAYMENT_METHODS,
      i18next.t("validation.field_required"),
    ),
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

/**
 * Router state for "Sell" on a showcase card: opens the new quick sale with
 * that item already added (price from the card, quantity 1) and the office
 * whose stock was being looked at.
 */
export const quickOrderPrefillStateSchema = z.object({
  locationId: z.number().int().positive(),
  product: z.object({
    warehouseItemId: z.number().int().positive(),
    name: z.string(),
    price: z.string(),
    /** Shown in the draft only — the backend copies it from the card. */
    purchasePrice: z.string(),
  }),
});
export type QuickOrderPrefillState = z.infer<
  typeof quickOrderPrefillStateSchema
>;

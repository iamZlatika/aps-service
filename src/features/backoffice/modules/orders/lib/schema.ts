import i18next from "i18next";
import { z } from "zod";

import { emailRegex } from "@/shared/lib/constants.ts";
import { PAYMENTS } from "@/shared/types.ts";

export const newOrderSchema = () =>
  z.object({
    customerName: z
      .string()
      .trim()
      .min(1, i18next.t("validation.field_required")),
    customerPrimaryPhone: z
      .string()
      .regex(/^\+380\d{9}$/, i18next.t("validation.phone_invalid")),
    customerSecondaryPhone: z
      .string()
      .transform((val) => (val === "" ? undefined : val))
      .optional()
      .refine(
        (val) => !val || /^\+380\d{9}$/.test(val),
        i18next.t("validation.phone_invalid"),
      ),
    customerEmail: z
      .string()
      .optional()
      .refine((val) => !val || emailRegex.test(val), {
        message: i18next.t("validation.email_invalid"),
      }),
    customerComment: z.string().optional(),
    managerId: z.number().int().positive(),
    assigneeId: z.number().int().positive().optional(),
    locationId: z.number().int().positive(),
    prepayment: z.string().optional(),
    isUrgent: z.boolean().optional(),
    issueType: z.string().trim().min(1, i18next.t("validation.field_required")),
    deviceType: z
      .string()
      .trim()
      .min(1, i18next.t("validation.field_required")),
    manufacturer: z
      .string()
      .trim()
      .min(1, i18next.t("validation.field_required")),
    deviceModel: z
      .string()
      .trim()
      .min(1, i18next.t("validation.field_required")),
    deviceCondition: z.array(z.string()).optional(),
    accessory: z.array(z.string()).optional(),
    intakeNote: z.string().optional(),
    devicePassword: z.string().min(1, i18next.t("validation.field_required")),
    estimatedCost: z.string().optional(),
    dueDate: z.string().optional(),
  });

export type NewOrderSchema = z.infer<ReturnType<typeof newOrderSchema>>;

export const newLineItemSchema = () =>
  z.object({
    name: z.string().trim().min(1, i18next.t("validation.field_required")),
    price: z.string().trim().min(1, i18next.t("validation.field_required")),
    quantity: z.coerce
      .number({ error: i18next.t("validation.field_required") })
      .int()
      .min(1, i18next.t("validation.minQuantity")),
    purchasePrice: z.string().optional().default(""),
    supplierName: z.string().optional(),
    costPrice: z.string().optional().default(""),
    managerId: z.number().int().positive().optional(),
  });

export type NewLineItemSchema = z.infer<ReturnType<typeof newLineItemSchema>>;
export type NewLineItemFormValues = z.input<
  ReturnType<typeof newLineItemSchema>
>;

export const newPaymentSchema = () =>
  z.object({
    type: z.enum([PAYMENTS.PREPAYMENT, PAYMENTS.PAYMENT, PAYMENTS.REFUND]),
    amount: z.string().trim().min(1, i18next.t("validation.field_required")),
    note: z.string().optional(),
    managerId: z.number().int().positive(),
  });

export type NewPaymentSchema = z.infer<ReturnType<typeof newPaymentSchema>>;
export type NewPaymentFormValues = z.input<ReturnType<typeof newPaymentSchema>>;

import i18next from "i18next";
import { z } from "zod";

import { emailRegex } from "@/shared/lib/constants.ts";
import {
  optionalPhoneField,
  phoneField,
  zodEnumFromConst,
} from "@/shared/lib/zod-helpers.ts";
import { PAYMENT_METHODS, PAYMENTS } from "@/shared/types.ts";

export const newOrderSchema = () =>
  z.object({
    customerName: z
      .string()
      .trim()
      .min(1, i18next.t("validation.field_required")),
    customerPrimaryPhone: phoneField(),
    customerSecondaryPhone: optionalPhoneField(),
    customerEmail: z
      .string()
      .optional()
      .refine((val) => !val || emailRegex.test(val), {
        message: i18next.t("validation.email_invalid"),
      }),
    customerComment: z.string().optional(),
    managerId: z.number().int().positive(),
    locationId: z
      .number({ error: i18next.t("validation.locationRequired") })
      .int()
      .positive(),
    referralId: z.number().int().positive().nullable().optional(),
    prepayment: z.string().optional(),
    prepaymentMethod: zodEnumFromConst(PAYMENT_METHODS),
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

export const newOrderItemSchema = () =>
  z.object({
    name: z.string().trim().min(1, i18next.t("validation.field_required")),
    price: z
      .string()
      .trim()
      .min(1, i18next.t("validation.field_required"))
      .regex(/^\d+$/, i18next.t("validation.digitsOnly")),
    quantity: z.coerce
      .number({ error: i18next.t("validation.field_required") })
      .int()
      .min(1, i18next.t("validation.minQuantity")),
    purchasePrice: z
      .string()
      .optional()
      .default("")
      .refine((value) => !value || /^\d+$/.test(value), {
        message: i18next.t("validation.digitsOnly"),
      }),
    supplierName: z.string().optional().default(""),
    costPrice: z
      .string()
      .optional()
      .default("")
      .refine((value) => !value || /^\d+$/.test(value), {
        message: i18next.t("validation.digitsOnly"),
      }),
    outsourcerName: z.string().optional().default(""),
    managerId: z.number().int().positive().optional(),
  });

export type NewOrderItemSchema = z.infer<ReturnType<typeof newOrderItemSchema>>;
export type NewOrderItemFormValues = z.input<
  ReturnType<typeof newOrderItemSchema>
>;

export const editOrderInfoSchema = () =>
  z.object({
    dueDate: z.string().optional(),
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
    devicePassword: z.string().min(1, i18next.t("validation.field_required")),
    deviceCondition: z.array(z.string()).optional(),
    accessory: z.array(z.string()).optional(),
    intakeNote: z.string().optional(),
    estimatedCost: z.string().optional(),
    referralId: z.number().int().positive().nullable().optional(),
  });

export type EditOrderInfoFormValues = z.input<
  ReturnType<typeof editOrderInfoSchema>
>;

export const newPaymentSchema = () =>
  z.object({
    type: z.enum([PAYMENTS.PREPAYMENT, PAYMENTS.PAYMENT, PAYMENTS.REFUND]),
    method: zodEnumFromConst(PAYMENT_METHODS),
    amount: z.string().trim().min(1, i18next.t("validation.field_required")),
    note: z.string().optional(),
    managerId: z.number().int().positive(),
  });

export type NewPaymentSchema = z.infer<ReturnType<typeof newPaymentSchema>>;
export type NewPaymentFormValues = z.input<ReturnType<typeof newPaymentSchema>>;

export const prefillStateSchema = z.object({
  customer: z.object({
    name: z.string(),
    email: z.string().nullable(),
    comment: z.string().nullable(),
    phones: z.array(
      z.object({ phoneNumber: z.string(), isPrimary: z.boolean() }),
    ),
  }),
});

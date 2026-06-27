import { z } from "zod";

import { zodEnumFromConst } from "@/shared/lib/zod-helpers";
import { USER_STATUSES } from "@/shared/types";

export const CustomerPhoneDtoSchema = z.object({
  id: z.number(),
  phone_number: z.string(),
  phone_verified_at: z.string().nullable(),
  is_primary: z.boolean(),
});
export type CustomerPhoneDto = z.infer<typeof CustomerPhoneDtoSchema>;

export const CustomerTelegramDtoSchema = z.object({
  is_subscribed: z.boolean(),
  linked_at: z.string().nullable(),
});
export type CustomerTelegramDto = z.infer<typeof CustomerTelegramDtoSchema>;

export const CustomerDtoSchema = z.object({
  id: z.number(),
  portal_name: z.string().nullable(),
  email: z.string().nullable(),
  pending_email: z.string().nullable(),
  email_verified_at: z.string().nullable(),
  has_google: z.boolean(),
  avatar_url: z.string(),
  phones: z.array(CustomerPhoneDtoSchema),
  telegram: CustomerTelegramDtoSchema.nullish(),
  status: zodEnumFromConst(USER_STATUSES),
  last_order_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type CustomerDto = z.infer<typeof CustomerDtoSchema>;

export const MeResponseDtoSchema = z.object({
  data: CustomerDtoSchema,
});
export type MeResponseDto = z.infer<typeof MeResponseDtoSchema>;

export const AuthResponseDtoSchema = z.object({
  token: z.string(),
  customer: CustomerDtoSchema,
});
export type AuthResponseDto = z.infer<typeof AuthResponseDtoSchema>;

export const VerifyPhoneResponseDtoSchema = z.union([
  z.object({ token: z.string(), customer: CustomerDtoSchema }),
  z.object({ data: CustomerDtoSchema }),
]);
export type VerifyPhoneResponseDto = z.infer<
  typeof VerifyPhoneResponseDtoSchema
>;

export const RegistrationResponseDtoSchema = z.object({
  email: z.string(),
});
export type RegistrationResponseDto = z.infer<
  typeof RegistrationResponseDtoSchema
>;

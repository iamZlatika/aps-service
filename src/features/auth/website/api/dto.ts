import { z } from "zod";

import { zodEnumFromConst } from "@/shared/lib/zod-helpers";
import { ROLES } from "@/shared/types";

export const ClientUserDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  role: zodEnumFromConst(ROLES),
});
export type ClientUserDto = z.infer<typeof ClientUserDtoSchema>;

export const AuthResponseDtoSchema = z.object({
  token: z.string(),
  user: ClientUserDtoSchema,
});
export type AuthResponseDto = z.infer<typeof AuthResponseDtoSchema>;

export type RegistrationRequestBody = {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
};

export const RegistrationResponseDtoSchema = z.object({
  email_verified: z.boolean(),
});
export type RegistrationResponseDto = z.infer<
  typeof RegistrationResponseDtoSchema
>;

export type LoginRequestBody = {
  email: string;
  password: string;
};

import { z } from "zod";

import { emailRegex } from "@/shared/lib/constants.ts";
import { zodEnumFromConst } from "@/shared/lib/zod-helpers.ts";
import { USER_STATUSES } from "@/shared/types.ts";

export const CustomerDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  phones: z.array(
    z.object({
      id: z.number(),
      phone_number: z.string(),
      phone_verified_at: z.string().nullable(),
      is_primary: z.boolean(),
    }),
  ),
  email: z.string().regex(emailRegex).nullable(),
  email_verified_at: z.string().nullable(),
  comment: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  status: zodEnumFromConst(USER_STATUSES),
});

export type CustomerDto = z.infer<typeof CustomerDtoSchema>;

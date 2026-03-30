import { z } from "zod";

import { emailRegex } from "@/shared/lib/constants.ts";
import { zodEnumFromConst } from "@/shared/lib/zod-helpers.ts";
import {
  ROLES,
  USER_LANGUAGES,
  USER_STATUSES,
  USER_THEMES,
} from "@/shared/types.ts";

export const UserDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().regex(emailRegex),
  role: zodEnumFromConst(ROLES),
  status: zodEnumFromConst(USER_STATUSES),
  locale: zodEnumFromConst(USER_LANGUAGES),
  theme: zodEnumFromConst(USER_THEMES),
  avatar_url: z.string(),
});
export type UserDto = z.infer<typeof UserDtoSchema>;

export const PaginatedUsersDtoSchema = z.object({
  data: z.array(UserDtoSchema),
  meta: z.object({
    current_page: z.number(),
    last_page: z.number(),
    total: z.number(),
    per_page: z.number(),
    from: z.number().nullable(),
    to: z.number().nullable(),
  }),
});

export type PaginatedUsersDto = z.infer<typeof PaginatedUsersDtoSchema>;

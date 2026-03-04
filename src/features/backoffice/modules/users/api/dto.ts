import { z } from "zod";

import { emailRegex } from "@/shared/lib/constats.ts";

export const UserDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().regex(emailRegex),
  role: z.enum(["head_manager", "user"]),
  status: z.enum(["active", "blocked"]),
});

export type UserDto = z.infer<typeof UserDtoSchema>;

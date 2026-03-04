import * as z from "zod";

import { emailRegex } from "@/shared/lib/constats.ts";

export const loginSchema = z.object({
  email: z.string().refine((val) => emailRegex.test(val), {
    message: "Введите корректный email",
  }),
  password: z
    .string()
    .min(8, { message: "Пароль должен быть не менее 8 символов" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

import * as z from "zod";

import { emailRegex } from "@/shared/lib/constats.ts";

export const forgotSchema = z.object({
  email: z.string().refine((val) => emailRegex.test(val), {
    message: "Введите корректный email",
  }),
});

export type ForgotFormValues = z.infer<typeof forgotSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Пароль должен быть не менее 8 символов" })
      .max(255, { message: "Пароль слишком длинный" }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Пароли не совпадают",
    path: ["password_confirmation"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

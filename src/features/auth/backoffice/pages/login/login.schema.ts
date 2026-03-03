import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Введите корректный email",
  }),
  password: z
    .string()
    .min(8, { message: "Пароль должен быть не менее 8 символов" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

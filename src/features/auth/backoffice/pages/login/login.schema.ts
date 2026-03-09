import i18next from "i18next";
import * as z from "zod";

import { emailRegex } from "@/shared/lib/constats.ts";

export const loginSchema = z.object({
  email: z.string().refine((val) => emailRegex.test(val), {
    message: i18next.t("validation.email_invalid"),
  }),
  password: z
    .string()
    .min(8, { message: i18next.t("validation.password_min") }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

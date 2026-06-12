import i18next from "i18next";
import { z } from "zod";

import { emailRegex } from "@/shared/lib/constants";

export const createLoginSchema = () =>
  z.object({
    email: z.string().refine((val) => emailRegex.test(val), {
      message: i18next.t("validation.email_invalid"),
    }),
    password: z
      .string()
      .min(8, { message: i18next.t("validation.password_min") }),
  });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

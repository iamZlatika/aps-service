import i18next from "i18next";
import { z } from "zod";

import { emailRegex } from "@/shared/lib/constants";

export const createForgotSchema = () =>
  z.object({
    email: z.string().refine((val) => emailRegex.test(val), {
      message: i18next.t("validation.email_invalid"),
    }),
  });

export type ForgotFormValues = z.infer<ReturnType<typeof createForgotSchema>>;

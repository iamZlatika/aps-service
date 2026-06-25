import i18next from "i18next";
import { z } from "zod";

import { emailRegex } from "@/shared/lib/constants";
import { phoneField } from "@/shared/lib/zod-helpers";

export const createRegistrationSchema = () =>
  z
    .object({
      name: z
        .string()
        .min(2, { message: i18next.t("validation.field_required") }),
      email: z.string().refine((val) => emailRegex.test(val), {
        message: i18next.t("validation.email_invalid"),
      }),
      phone: phoneField(),
      password: z
        .string()
        .min(8, { message: i18next.t("validation.password_min") }),
      passwordConfirmation: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: i18next.t("validation.passwords_dont_match"),
      path: ["passwordConfirmation"],
    });

export type RegistrationFormValues = z.infer<
  ReturnType<typeof createRegistrationSchema>
>;

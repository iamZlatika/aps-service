import i18next from "i18next";
import { z } from "zod";

import { phoneField } from "@/shared/lib/zod-helpers";

export const createAddPhoneSchema = () =>
  z.object({
    phone: phoneField(),
  });

export type AddPhoneFormValues = z.infer<
  ReturnType<typeof createAddPhoneSchema>
>;

export const createVerifyPhoneCodeSchema = () =>
  z.object({
    code: z.string().regex(/^\d{4}$/, {
      message: i18next.t("validation.code_invalid"),
    }),
  });

export type VerifyPhoneCodeFormValues = z.infer<
  ReturnType<typeof createVerifyPhoneCodeSchema>
>;

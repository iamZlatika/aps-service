import i18next from "i18next";
import { z } from "zod";

export const createAddPhoneSchema = () =>
  z.object({
    phone: z.string().regex(/^\+380\d{9}$/, {
      message: i18next.t("validation.phone_invalid"),
    }),
  });

export type AddPhoneFormValues = z.infer<
  ReturnType<typeof createAddPhoneSchema>
>;

import i18next from "i18next";
import { z } from "zod";

export const trackOrderSchema = z.object({
  orderNumber: z
    .string()
    .regex(
      /^APS-\d{4}-\d{6}$/,
      i18next.t("trackModal.invalidFormat", { ns: "website" }),
    ),
});

export type TrackOrderValues = z.infer<typeof trackOrderSchema>;

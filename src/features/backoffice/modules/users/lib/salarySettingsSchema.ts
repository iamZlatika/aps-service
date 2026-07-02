import i18next from "i18next";
import { z } from "zod";

export const salarySettingsSchema = () =>
  z.object({
    servicesPercent: z
      .number()
      .min(0, i18next.t("validation.percent_range"))
      .max(100, i18next.t("validation.percent_range")),
    productsPercent: z
      .number()
      .min(0, i18next.t("validation.percent_range"))
      .max(100, i18next.t("validation.percent_range")),
    intakePercent: z
      .number()
      .min(0, i18next.t("validation.percent_range"))
      .max(100, i18next.t("validation.percent_range")),
  });

export type SalarySettings = z.infer<ReturnType<typeof salarySettingsSchema>>;

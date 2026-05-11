import { z } from "zod";

export const salarySettingsSchema = z.object({
  servicesPercent: z.number().min(0).max(100),
  productsPercent: z.number().min(0).max(100),
  intakePercent: z.number().min(0).max(100),
});

export type SalarySettings = z.infer<typeof salarySettingsSchema>;

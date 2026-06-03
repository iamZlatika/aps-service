import { z } from "zod";

export const StatusDtoSchema = z.object({
  id: z.number(),
  key: z.string(),
  name_ru: z.string(),
  name_ua: z.string(),
  color: z.string(),
  is_system: z.boolean(),
});

export type StatusDto = z.infer<typeof StatusDtoSchema>;

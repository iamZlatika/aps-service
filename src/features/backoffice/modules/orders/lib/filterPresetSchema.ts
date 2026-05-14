import { z } from "zod";

export const filterPresetSchema = z.object({
  name: z.string().min(1),
  any_match: z.string().nullable(),
  status_ids: z.array(z.number()),
  location_id: z.number().nullable(),
  manager_id: z.number().nullable(),
  is_urgent: z.number().nullable(),
});

export type FilterPresetFormValues = z.infer<typeof filterPresetSchema>;

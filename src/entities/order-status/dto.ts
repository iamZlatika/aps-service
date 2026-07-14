import { z } from "zod";

import { zodEnumFromConst } from "@/shared/lib/zod-helpers";
import { STATUS_COLORS } from "@/shared/types";

export const StatusDtoSchema = z.object({
  id: z.number(),
  key: z.string(),
  name_ru: z.string(),
  name_ua: z.string(),
  color: zodEnumFromConst(STATUS_COLORS),
  is_system: z.boolean(),
});

export type StatusDto = z.infer<typeof StatusDtoSchema>;

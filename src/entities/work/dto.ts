import { z } from "zod";

import { zodEnumFromConst } from "@/shared/lib/zod-helpers";

import { WORK_PHOTO_TYPES, WORK_TYPES } from "./types";

export const WorkTypeDtoSchema = z.object({
  key: zodEnumFromConst(WORK_TYPES),
  name_ru: z.string(),
  name_uk: z.string(),
});

export const WorkPhotoDtoSchema = z.object({
  type: zodEnumFromConst(WORK_PHOTO_TYPES),
  url: z.string(),
});
export type WorkPhotoDto = z.infer<typeof WorkPhotoDtoSchema>;

export const WorkDtoSchema = z.object({
  id: z.number(),
  type: WorkTypeDtoSchema,
  device_type: z.string(),
  manufacturer: z.string(),
  device_model: z.string(),
  reason_ru: z.string().nullable(),
  reason_uk: z.string().nullable(),
  description_ru: z.string(),
  description_uk: z.string(),
  created_at: z.string(),
  photos: z.array(WorkPhotoDtoSchema),
});

export type WorkDto = z.infer<typeof WorkDtoSchema>;

export const WorksResponseDtoSchema = z.object({
  data: z.array(WorkDtoSchema),
  meta: z.object({ last_page: z.number() }),
});

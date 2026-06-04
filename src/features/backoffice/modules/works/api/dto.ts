import { z } from "zod";

import { WorkDtoSchema } from "@/entities/work/dto";

export const BackofficeWorkDtoSchema = WorkDtoSchema.extend({
  is_published: z.boolean(),
});
export type BackofficeWorkDto = z.infer<typeof BackofficeWorkDtoSchema>;

const PaginationMetaDtoSchema = z.object({
  current_page: z.number(),
  last_page: z.number(),
  total: z.number(),
});

export const BackofficeWorksListDtoSchema = z.object({
  data: z.array(BackofficeWorkDtoSchema),
  meta: PaginationMetaDtoSchema,
});

export const BackofficeWorkItemDtoSchema = z.object({
  data: BackofficeWorkDtoSchema,
});

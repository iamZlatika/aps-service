import { z } from "zod";

export const DictionaryItemDtoSchema = z.looseObject({
  id: z.number(),
  name: z.string(),
});
export type DictionaryItemDto = z.infer<typeof DictionaryItemDtoSchema>;

export const DictionaryItemsDtoSchema = z.array(DictionaryItemDtoSchema);

export const PaginationLinksDtoSchema = z.object({
  first: z.string().nullable(),
  last: z.string().nullable(),
  prev: z.string().nullable(),
  next: z.string().nullable(),
});

export const PaginationMetaLinkDtoSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  page: z.number().nullable().optional(),
  active: z.boolean(),
});

export const PaginationMetaDtoSchema = z.object({
  current_page: z.number(),
  from: z.number().nullable(),
  last_page: z.number(),
  links: z.array(PaginationMetaLinkDtoSchema),
  path: z.string(),
  per_page: z.number(),
  to: z.number().nullable(),
  total: z.number(),
});

export const PaginatedDictionaryItemsDtoSchema = z.object({
  data: DictionaryItemsDtoSchema,
  links: PaginationLinksDtoSchema,
  meta: PaginationMetaDtoSchema,
});

export type PaginatedDictionaryItemsDto = z.infer<
  typeof PaginatedDictionaryItemsDtoSchema
>;

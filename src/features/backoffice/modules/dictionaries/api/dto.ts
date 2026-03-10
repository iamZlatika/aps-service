import { z } from "zod";

export const DictionaryItemDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type DictionaryItemDto = z.infer<typeof DictionaryItemDtoSchema>;

export const DictionaryItemsDtoSchema = z.array(DictionaryItemDtoSchema);

export const CreateDictionaryItemDtoSchema = z.object({
  name: z.string(),
});

export type CreateDictionaryItemDto = z.infer<
  typeof CreateDictionaryItemDtoSchema
>;

import { z } from "zod";

const PriceListCategoryDtoSchema = z.object({
  key: z.string(),
  name_ru: z.string(),
  name_uk: z.string(),
});

export const PriceListItemDtoSchema = z.object({
  id: z.number(),
  category: PriceListCategoryDtoSchema,
  name_ru: z.string(),
  name_uk: z.string(),
  price: z.number(),
  price_note_ru: z.string().nullable(),
  price_note_uk: z.string().nullable(),
  sort_order: z.number(),
});

export type PriceListItemDto = z.infer<typeof PriceListItemDtoSchema>;

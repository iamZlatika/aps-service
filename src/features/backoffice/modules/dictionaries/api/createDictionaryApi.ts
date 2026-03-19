import {
  type CreateDictionaryItemDto,
  type DictionaryItemDto,
  DictionaryItemDtoSchema,
  DictionaryItemsDtoSchema,
} from "@/features/backoffice/modules/dictionaries/api/dto.ts";
import { mapDictionaryItemDtoToDictionaryItem } from "@/features/backoffice/modules/dictionaries/lib/adapter.ts";
import { type DictionaryItem } from "@/features/backoffice/modules/dictionaries/types.ts";
import { del, get, post, put } from "@/shared/api/api.ts";

interface DictionaryApiRoutes {
  list: () => string;
  item: (id: number) => string;
}

export const createDictionaryApi = (routes: DictionaryApiRoutes) => ({
  getAll: async (): Promise<DictionaryItem[]> => {
    const response = await get<{ data: DictionaryItemDto[] }>(routes.list());
    const validated = DictionaryItemsDtoSchema.parse(response.data);
    return validated.map(mapDictionaryItemDtoToDictionaryItem);
  },

  create: async (data: CreateDictionaryItemDto): Promise<DictionaryItem> => {
    const response = await post<
      CreateDictionaryItemDto,
      { data: DictionaryItemDto }
    >(routes.list(), data);
    const validated = DictionaryItemDtoSchema.parse(response.data);
    return mapDictionaryItemDtoToDictionaryItem(validated);
  },

  update: async (
    id: number,
    data: CreateDictionaryItemDto,
  ): Promise<DictionaryItem> => {
    const response = await put<
      CreateDictionaryItemDto,
      { data: DictionaryItemDto }
    >(routes.item(id), data);
    const validated = DictionaryItemDtoSchema.parse(response.data);
    return mapDictionaryItemDtoToDictionaryItem(validated);
  },

  remove: async (id: number): Promise<void> => {
    await del(routes.item(id));
  },
});

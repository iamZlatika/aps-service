import {
  type CreateDictionaryItemDto,
  type DictionaryItemDto,
  DictionaryItemDtoSchema,
  type PaginatedDictionaryItemsDto,
  PaginatedDictionaryItemsDtoSchema,
} from "@/features/backoffice/modules/dictionaries/api/dto.ts";
import {
  mapDictionaryItemDtoToDictionaryItem,
  mapPaginatedDtoToPaginatedItems,
} from "@/features/backoffice/modules/dictionaries/lib/adapter.ts";
import {
  type DictionaryItem,
  type PaginatedDictionaryItems,
} from "@/features/backoffice/modules/dictionaries/types.ts";
import { del, get, post, put } from "@/shared/api/api.ts";

interface DictionaryApiRoutes {
  list: () => string;
  item: (id: number) => string;
}

export const createDictionaryApi = (routes: DictionaryApiRoutes) => ({
  getAll: async (
    page: number = 1,
    perPage: number = 15,
  ): Promise<PaginatedDictionaryItems> => {
    const response = await get<PaginatedDictionaryItemsDto>(
      `${routes.list()}?page=${page}&per_page=${perPage}`,
    );
    const validated = PaginatedDictionaryItemsDtoSchema.parse(response);
    return mapPaginatedDtoToPaginatedItems(validated);
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

export type DictionaryApi = ReturnType<typeof createDictionaryApi>;

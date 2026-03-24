import {
  type DictionaryItemDto,
  DictionaryItemDtoSchema,
  type PaginatedDictionaryItemsDto,
  PaginatedDictionaryItemsDtoSchema,
} from "@/features/backoffice/modules/dictionaries/api/dto.ts";
import {
  mapDictionaryItemDtoToDictionaryItem,
  mapPaginatedDtoToPaginatedItems,
} from "@/features/backoffice/modules/dictionaries/lib/adapter.ts";
import { type PaginatedDictionaryItems } from "@/features/backoffice/modules/dictionaries/types.ts";
import { del, get, post, put } from "@/shared/api/api.ts";
import { type SortType } from "@/shared/components/table/hooks/useSortParams.ts";
import { type BaseItem } from "@/shared/components/table/types.ts";

interface DictionaryApiRoutes {
  list: () => string;
  item: (id: number) => string;
}

export const createDictionaryApi = (routes: DictionaryApiRoutes) => ({
  getAll: async (
    page: number = 1,
    perPage: number = 15,
    sortColumn?: string | null,
    sortType?: SortType,
  ): Promise<PaginatedDictionaryItems> => {
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
    });
    if (sortColumn && sortType && sortType !== "none") {
      params.set("sort_column", sortColumn);
      params.set("sort_type", sortType);
    }

    const response = await get<PaginatedDictionaryItemsDto>(
      `${routes.list()}?${params.toString()}`,
    );
    const validated = PaginatedDictionaryItemsDtoSchema.parse(response);
    return mapPaginatedDtoToPaginatedItems(validated);
  },
  create: async (data: Partial<BaseItem>): Promise<BaseItem> => {
    const response = await post<Partial<BaseItem>, { data: DictionaryItemDto }>(
      routes.list(),
      data,
    );
    const validated = DictionaryItemDtoSchema.parse(response.data);
    return mapDictionaryItemDtoToDictionaryItem(validated);
  },
  update: async (
    id: number,
    data: Record<string, unknown>,
  ): Promise<BaseItem> => {
    const response = await put<
      Record<string, unknown>,
      { data: DictionaryItemDto }
    >(routes.item(id), data);
    const validated = DictionaryItemDtoSchema.parse(response.data);
    return mapDictionaryItemDtoToDictionaryItem(validated);
  },
  remove: async (id: number): Promise<void> => {
    await del(routes.item(id));
  },
});

import {
  type CreateDictionaryItemDto,
  type DictionaryItemDto,
  DictionaryItemDtoSchema,
  DictionaryItemsDtoSchema,
} from "@/features/backoffice/modules/dictionaries/api/dto.ts";
import { mapDictionaryItemDtoToDictionaryItem } from "@/features/backoffice/modules/dictionaries/lib/adapter.ts";
import { type DictionaryItem } from "@/features/backoffice/modules/dictionaries/models/types.ts";
import { DictionariesRoutes } from "@/features/backoffice/modules/dictionaries/routers.ts";
import { del, get, post, put } from "@/shared/api/apiClient.ts";

export const dictionariesApi = {
  getDictionaryAccessories: async (): Promise<DictionaryItem[]> => {
    const response = await get<{ data: DictionaryItemDto[] }>(
      DictionariesRoutes.accessoriesApi(),
    );

    const validatedData = DictionaryItemsDtoSchema.parse(response.data);
    return validatedData.map(mapDictionaryItemDtoToDictionaryItem);
  },
  createDictionaryAccessory: async (
    data: CreateDictionaryItemDto,
  ): Promise<DictionaryItem> => {
    const response = await post<
      CreateDictionaryItemDto,
      { data: DictionaryItemDto }
    >(DictionariesRoutes.accessoriesApi(), data);

    const validatedData = DictionaryItemDtoSchema.parse(response.data);
    return mapDictionaryItemDtoToDictionaryItem(validatedData);
  },
  deleteDictionaryAccessory: async (id: number): Promise<void> => {
    await del(DictionariesRoutes.accessoryApi(id));
  },
  updateDictionaryAccessory: async (
    id: number,
    data: CreateDictionaryItemDto,
  ): Promise<DictionaryItem> => {
    const response = await put<
      CreateDictionaryItemDto,
      { data: DictionaryItemDto }
    >(DictionariesRoutes.accessoryApi(id), data);

    const validatedData = DictionaryItemDtoSchema.parse(response.data);
    return mapDictionaryItemDtoToDictionaryItem(validatedData);
  },
};

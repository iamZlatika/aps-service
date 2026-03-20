import {
  type DictionaryItemDto,
  type PaginatedDictionaryItemsDto,
} from "@/features/backoffice/modules/dictionaries/api/dto.ts";
import {
  type DictionaryItem,
  type PaginatedDictionaryItems,
} from "@/features/backoffice/modules/dictionaries/types.ts";

export const mapDictionaryItemDtoToDictionaryItem = (
  dto: DictionaryItemDto,
): DictionaryItem => {
  return {
    id: dto.id,
    name: dto.name,
  };
};

export const mapPaginatedDtoToPaginatedItems = (
  dto: PaginatedDictionaryItemsDto,
): PaginatedDictionaryItems => {
  return {
    items: dto.data.map(mapDictionaryItemDtoToDictionaryItem),
    meta: {
      currentPage: dto.meta.current_page,
      lastPage: dto.meta.last_page,
      perPage: dto.meta.per_page,
      total: dto.meta.total,
      from: dto.meta.from,
      to: dto.meta.to,
    },
  };
};

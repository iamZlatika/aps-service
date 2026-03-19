import { type DictionaryItemDto } from "@/features/backoffice/modules/dictionaries/api/dto.ts";
import { type DictionaryItem } from "@/features/backoffice/modules/dictionaries/types.ts";

export const mapDictionaryItemDtoToDictionaryItem = (
  dto: DictionaryItemDto,
): DictionaryItem => {
  return {
    id: dto.id,
    name: dto.name,
  };
};

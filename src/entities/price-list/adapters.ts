import { type PriceListItemDto } from "./dto";
import { type PriceListItem } from "./types";

export function mapPriceListItemDtoToPriceListItem(
  dto: PriceListItemDto,
): PriceListItem {
  return {
    id: dto.id,
    category: {
      key: dto.category.key,
      nameRu: dto.category.name_ru,
      nameUk: dto.category.name_uk,
    },
    nameRu: dto.name_ru,
    nameUk: dto.name_uk,
    price: dto.price,
    priceNoteRu: dto.price_note_ru,
    priceNoteUk: dto.price_note_uk,
    sortOrder: dto.sort_order,
  };
}

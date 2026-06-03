import {
  type PaginationMetaDto,
  type PriceListItemPayload,
} from "@/features/backoffice/modules/dictionaries/api/dto.ts";
import {
  type PaginatedDictionaryItems,
  type PaginationMeta,
} from "@/features/backoffice/modules/dictionaries/types.ts";
import type { BaseItem } from "@/features/backoffice/widgets/table/models/types.ts";

export { mapLocationDtoToLocation } from "@/entities/location/adapters";
export { mapPriceListItemDtoToPriceListItem } from "@/entities/price-list/adapters";

export const mapPaginationMeta = (meta: PaginationMetaDto): PaginationMeta => ({
  currentPage: meta.current_page,
  lastPage: meta.last_page,
  perPage: meta.per_page,
  total: meta.total,
  from: meta.from,
  to: meta.to,
});

export const mapPaginatedItems = <T extends BaseItem>(
  items: T[],
  meta: PaginationMetaDto,
): PaginatedDictionaryItems<T> => ({
  items,
  meta: mapPaginationMeta(meta),
});

export const mapPriceListFormDataToPayload = (
  data: Record<string, unknown>,
): PriceListItemPayload => ({
  name_ru: String(data.nameRu ?? ""),
  name_uk: String(data.nameUk ?? ""),
  category: String(data.category ?? ""),
  price: Number(data.price),
  price_note_ru: data.priceNoteRu ? String(data.priceNoteRu) : null,
  price_note_uk: data.priceNoteUk ? String(data.priceNoteUk) : null,
  sort_order: Number(data.sortOrder),
});

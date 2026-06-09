import {
  type OutsourcerDto,
  type PaginationMetaDto,
  type PriceListItemPayload,
  type SupplierDto,
} from "@/features/backoffice/modules/dictionaries/api/dto.ts";
import {
  type Outsourcer,
  type PaginatedDictionaryItems,
  type PaginationMeta,
  type Supplier,
} from "@/features/backoffice/modules/dictionaries/types.ts";
import type { BaseItem } from "@/features/backoffice/widgets/table/models/types.ts";

export { mapLocationDtoToLocation } from "@/entities/location/adapters";
export { mapPriceListItemDtoToPriceListItem } from "@/entities/price-list/adapters";

export function mapPaginationMeta(meta: PaginationMetaDto): PaginationMeta {
  return {
    currentPage: meta.current_page,
    lastPage: meta.last_page,
    perPage: meta.per_page,
    total: meta.total,
    from: meta.from,
    to: meta.to,
  };
}

export function mapPaginatedItems<T extends BaseItem>(
  items: T[],
  meta: PaginationMetaDto,
): PaginatedDictionaryItems<T> {
  return {
    items,
    meta: mapPaginationMeta(meta),
  };
}

export function mapSupplierDtoToSupplier(dto: SupplierDto): Supplier {
  return {
    id: dto.id,
    name: dto.name,
    managerName: dto.manager_name ?? null,
    phone: dto.phone ?? null,
    website: dto.website ?? null,
  };
}

export function mapOutsourcerDtoToOutsourcer(dto: OutsourcerDto): Outsourcer {
  return mapSupplierDtoToSupplier(dto);
}

export function mapPriceListFormDataToPayload(
  data: Record<string, unknown>,
): PriceListItemPayload {
  return {
    name_ru: String(data.nameRu ?? ""),
    name_uk: String(data.nameUk ?? ""),
    category: String(data.category ?? ""),
    price: Number(data.price),
    price_note_ru: data.priceNoteRu ? String(data.priceNoteRu) : null,
    price_note_uk: data.priceNoteUk ? String(data.priceNoteUk) : null,
    sort_order: Number(data.sortOrder),
  };
}

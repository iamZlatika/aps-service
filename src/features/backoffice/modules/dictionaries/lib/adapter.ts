import {
  type LocationDto,
  type PaginationMetaDto,
} from "@/features/backoffice/modules/dictionaries/api/dto.ts";
import {
  type Location,
  type PaginatedDictionaryItems,
  type PaginationMeta,
} from "@/features/backoffice/modules/dictionaries/types.ts";
import type { BaseItem } from "@/features/backoffice/widgets/table/models/types.ts";

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

export const mapLocationDtoToLocation = (dto: LocationDto): Location => ({
  id: dto.id,
  name: dto.name,
  address: dto.address,
  phone: dto.phone,
});

import {
  type LocationDto,
  type PaginationMetaDto,
} from "@/features/backoffice/modules/dictionaries/api/dto.ts";
import {
  type PaginatedDictionaryItems,
  type PaginationMeta,
} from "@/features/backoffice/modules/dictionaries/types.ts";
import type { BaseItem } from "@/features/backoffice/widgets/table/models/types.ts";
import { type Location } from "@/shared/types";

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
  cityRu: dto.city_ru,
  cityUa: dto.city_ua,
  districtRu: dto.district_ru,
  districtUa: dto.district_ua,
  streetRu: dto.street_ru,
  streetUa: dto.street_ua,
  building: dto.building,
  addressRu: dto.address_ru,
  addressUa: dto.address_ua,
  phone: dto.phone,
  schedule: dto.schedule,
  scheduleDisplay: dto.schedule_display,
});

import { type LocationDto } from "./dto";
import { type Location } from "./types";

export function mapLocationDtoToLocation(dto: LocationDto): Location {
  return {
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
    reviewUrl: dto.review_url,
    schedule: dto.schedule,
    scheduleDisplay: dto.schedule_display,
  };
}

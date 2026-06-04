import { type WorkDto, type WorkPhotoDto } from "./dto";
import { type Work, type WorkPhoto } from "./types";

function mapWorkPhotoDto(dto: WorkPhotoDto): WorkPhoto {
  return {
    type: dto.type,
    url: dto.url,
  };
}

export function mapWorkDtoToWork(dto: WorkDto): Work {
  return {
    id: dto.id,
    type: {
      key: dto.type.key,
      nameRu: dto.type.name_ru,
      nameUk: dto.type.name_uk,
    },
    deviceType: dto.device_type,
    manufacturer: dto.manufacturer,
    deviceModel: dto.device_model,
    reasonRu: dto.reason_ru,
    reasonUk: dto.reason_uk,
    descriptionRu: dto.description_ru,
    descriptionUk: dto.description_uk,
    createdAt: dto.created_at,
    photos: dto.photos.map(mapWorkPhotoDto),
  };
}

import { mapWorkDtoToWork } from "@/entities/work/adapters";

import { type BackofficeWorkDto } from "../api/dto";
import { type BackofficeWork } from "../types";

export function mapBackofficeWorkDtoToBackofficeWork(
  dto: BackofficeWorkDto,
): BackofficeWork {
  return {
    ...mapWorkDtoToWork(dto),
    isPublished: dto.is_published,
  };
}

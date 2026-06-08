import {
  type Work,
  WORK_TYPES,
  type WorkPhoto,
  type WorkType,
} from "@/entities/work/types";

import { type WorkFormValues } from "./work.schema";

const WORK_TYPE_NAMES: Record<WorkType, { nameRu: string; nameUk: string }> = {
  [WORK_TYPES.REPAIR]: { nameRu: "Ремонт", nameUk: "Ремонт" },
  [WORK_TYPES.UPGRADE]: { nameRu: "Апгрейд", nameUk: "Апгрейд" },
};

export function buildPreviewWork(
  values: WorkFormValues,
  photos: WorkPhoto[],
): Work {
  return {
    id: 0,
    type: { key: values.type, ...WORK_TYPE_NAMES[values.type] },
    deviceType: values.device_type,
    manufacturer: values.manufacturer,
    deviceModel: values.device_model,
    reasonRu: values.reason_ru || null,
    reasonUk: values.reason_uk || null,
    descriptionRu: values.description_ru,
    descriptionUk: values.description_uk,
    createdAt: new Date().toISOString(),
    photos,
  };
}

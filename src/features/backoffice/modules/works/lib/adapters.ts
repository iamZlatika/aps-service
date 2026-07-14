import { mapWorkDtoToWork } from "@/entities/work/adapters";

import { type BackofficeWorkDto } from "../api/dto";
import { type WorkFormValues } from "../lib/work.schema";
import { type WorkEditFormValues } from "../lib/work-edit.schema";
import { type BackofficeWork } from "../types";

export function mapFormValuesToFormData(values: WorkFormValues): FormData {
  const fd = new FormData();
  fd.append("type", values.type);
  fd.append("device_type", values.device_type);
  fd.append("manufacturer", values.manufacturer);
  fd.append("device_model", values.device_model);
  fd.append("description_ru", values.description_ru);
  fd.append("description_uk", values.description_uk);
  fd.append("is_published", values.is_published ? "1" : "0");
  if (values.reason_ru) fd.append("reason_ru", values.reason_ru);
  if (values.reason_uk) fd.append("reason_uk", values.reason_uk);
  if (values.main_photo) fd.append("main_photo", values.main_photo);
  if (values.before_photo) fd.append("before_photo", values.before_photo);
  if (values.after_photo) fd.append("after_photo", values.after_photo);
  values.additional_photos?.forEach((file) =>
    fd.append("additional_photos[]", file),
  );
  return fd;
}

export function mapBackofficeWorkDtoToBackofficeWork(
  dto: BackofficeWorkDto,
): BackofficeWork {
  return {
    ...mapWorkDtoToWork(dto),
    isPublished: dto.is_published,
  };
}

export function mapBackofficeWorkToEditFormValues(
  work: BackofficeWork,
): WorkEditFormValues {
  return {
    device_type: work.deviceType,
    manufacturer: work.manufacturer,
    device_model: work.deviceModel,
    description_ru: work.descriptionRu,
    description_uk: work.descriptionUk,
    reason_ru: work.reasonRu ?? "",
    reason_uk: work.reasonUk ?? "",
  };
}

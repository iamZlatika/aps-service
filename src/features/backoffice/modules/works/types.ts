import { type Work, type WorkType } from "@/entities/work/types";

export type BackofficeWork = Work & {
  isPublished: boolean;
};

export type WorkPayload = {
  type_key: WorkType;
  device_type: string;
  manufacturer: string;
  device_model: string;
  reason_ru: string | null;
  reason_uk: string | null;
  description_ru: string;
  description_uk: string;
};

export type SetPublishedPayload = {
  is_published: boolean;
};

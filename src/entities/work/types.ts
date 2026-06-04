export const WORK_TYPES = {
  REPAIR: "repair",
  UPGRADE: "upgrade",
} as const;
export type WorkType = (typeof WORK_TYPES)[keyof typeof WORK_TYPES];

export const WORK_PHOTO_TYPES = {
  BEFORE: "before",
  AFTER: "after",
  MAIN: "main",
  ADDITIONAL: "additional",
} as const;
export type WorkPhotoType =
  (typeof WORK_PHOTO_TYPES)[keyof typeof WORK_PHOTO_TYPES];

export type WorkTypeInfo = {
  key: WorkType;
  nameRu: string;
  nameUk: string;
};

export type WorkPhoto = {
  type: WorkPhotoType;
  url: string;
};

export type Work = {
  id: number;
  type: WorkTypeInfo;
  deviceType: string;
  manufacturer: string;
  deviceModel: string;
  reasonRu: string | null;
  reasonUk: string | null;
  descriptionRu: string;
  descriptionUk: string;
  createdAt: string;
  photos: WorkPhoto[];
};

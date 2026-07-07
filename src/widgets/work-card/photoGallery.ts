import { type Work, WORK_PHOTO_TYPES, WORK_TYPES } from "@/entities/work/types";
import { type LightboxImage } from "@/widgets/lightbox/utils";

export type PhotoLabels = {
  before: string;
  after: string;
  upgrade: string;
};

export function buildLightboxImages(
  work: Work,
  labels: PhotoLabels,
): LightboxImage[] {
  if (work.type.key === WORK_TYPES.REPAIR) {
    const before = work.photos.find((p) => p.type === WORK_PHOTO_TYPES.BEFORE);
    const after = work.photos.find((p) => p.type === WORK_PHOTO_TYPES.AFTER);
    const additional = work.photos.filter(
      (p) => p.type === WORK_PHOTO_TYPES.ADDITIONAL,
    );
    return [
      ...(before
        ? [
            {
              url: before.url,
              tag: labels.before,
              tagVariant: "before" as const,
            },
          ]
        : []),
      ...(after
        ? [{ url: after.url, tag: labels.after, tagVariant: "after" as const }]
        : []),
      ...additional.map((p) => ({ url: p.url })),
    ];
  }

  const main = work.photos.find((p) => p.type === WORK_PHOTO_TYPES.MAIN);
  const additional = work.photos.filter(
    (p) => p.type === WORK_PHOTO_TYPES.ADDITIONAL,
  );
  return [
    ...(main
      ? [
          {
            url: main.url,
            tag: labels.upgrade,
            tagVariant: "upgrade" as const,
          },
        ]
      : []),
    ...additional.map((p) => ({ url: p.url })),
  ];
}

export function buildGridImages(
  work: Work,
  allImages: LightboxImage[],
): LightboxImage[] {
  if (work.type.key === WORK_TYPES.REPAIR) {
    return allImages.filter(
      (img) => img.tagVariant === "before" || img.tagVariant === "after",
    );
  }
  return allImages.filter((img) => img.tagVariant === "upgrade");
}

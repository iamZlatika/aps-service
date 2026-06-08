import { ZoomIn } from "lucide-react";
import { type SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { type Work, WORK_TYPES } from "@/entities/work/types";
import { cn } from "@/shared/lib/utils";
import { Lightbox } from "@/widgets/lightbox";
import { getTagClass, type LightboxImage } from "@/widgets/lightbox/utils";

interface WorkMediaProps {
  work: Work;
}

type PhotoLabels = {
  before: string;
  after: string;
  upgrade: string;
};

type Orientation = "portrait" | "landscape";

function buildLightboxImages(work: Work, labels: PhotoLabels): LightboxImage[] {
  if (work.type.key === WORK_TYPES.REPAIR) {
    const before = work.photos.find((p) => p.type === "before");
    const after = work.photos.find((p) => p.type === "after");
    const additional = work.photos.filter((p) => p.type === "additional");
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

  const main = work.photos.find((p) => p.type === "main");
  const additional = work.photos.filter((p) => p.type === "additional");
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

function buildGridImages(work: Work, labels: PhotoLabels): LightboxImage[] {
  const all = buildLightboxImages(work, labels);
  if (work.type.key === WORK_TYPES.REPAIR) {
    return all.filter(
      (img) => img.tagVariant === "before" || img.tagVariant === "after",
    );
  }
  return all.slice(0, 3);
}

export const WorkMedia = ({ work }: WorkMediaProps) => {
  const { t } = useTranslation("website");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [orientations, setOrientations] = useState<Record<number, Orientation>>(
    {},
  );

  const labels: PhotoLabels = {
    before: t("works.tagBefore"),
    after: t("works.tagAfter"),
    upgrade: t("works.tagUpgrade"),
  };

  const allImages = buildLightboxImages(work, labels);
  const gridImages = buildGridImages(work, labels);

  const firstPhotoUrl = gridImages[0]?.url;
  useEffect(() => {
    setOrientations({});
  }, [firstPhotoUrl, gridImages.length]);

  const handleImgLoad = (e: SyntheticEvent<HTMLImageElement>, i: number) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setOrientations((prev) => ({
      ...prev,
      [i]: naturalWidth >= naturalHeight ? "landscape" : "portrait",
    }));
  };

  const isSingle = gridImages.length === 1;
  const allDetected =
    !isSingle && Object.keys(orientations).length === gridImages.length;
  const isStacked =
    allDetected && Object.values(orientations).every((o) => o === "landscape");

  return (
    <div
      className={cn(
        "ws-work-media grid gap-[2px] bg-ws-line-soft",
        isSingle || isStacked ? "grid-cols-1" : "grid-cols-2",
      )}
    >
      {gridImages.map((img, i) => {
        const lightboxIdx = allImages.findIndex((a) => a.url === img.url);
        return (
          <button
            key={`${img.url}-${i}`}
            type="button"
            onClick={() => setLightboxIndex(lightboxIdx >= 0 ? lightboxIdx : i)}
            className={cn(
              "group relative cursor-zoom-in overflow-hidden bg-ws-bg-2",
              isStacked ? "aspect-[2/1]" : "max-[860px]:aspect-square",
            )}
            aria-label={img.tag ?? `${t("works.eyebrow")} ${i + 1}`}
          >
            <img
              src={img.url}
              alt=""
              loading="lazy"
              onLoad={(e) => handleImgLoad(e, i)}
              className="size-full object-cover"
            />
            {img.tag && (
              <span
                className={cn(
                  "absolute left-3 top-3 z-[2] rounded-full border border-white/[0.18] px-[11px] py-[5px] text-[10.5px] font-bold uppercase tracking-[0.1em] backdrop-blur-[8px]",
                  getTagClass(img.tagVariant),
                )}
              >
                {img.tag}
              </span>
            )}
            <span
              aria-hidden="true"
              className="absolute bottom-3 right-3 z-[2] flex size-8 items-center justify-center rounded-[9px] border border-white/[0.16] bg-[color-mix(in_oklab,var(--ws-bg-2)_80%,transparent)] text-ws-ink opacity-0 backdrop-blur-[8px] transition-opacity group-hover:opacity-100"
            >
              <ZoomIn className="size-[15px]" />
            </span>
          </button>
        );
      })}

      {lightboxIndex !== null && (
        <Lightbox
          images={allImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
};

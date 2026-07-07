import { ZoomIn } from "lucide-react";
import { type SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { type Work } from "@/entities/work/types";
import { cn } from "@/shared/lib/utils";
import { getTagClass, type LightboxImage } from "@/widgets/lightbox/utils";
import { buildGridImages } from "@/widgets/work-card/photoGallery";

interface WorkMediaProps {
  work: Work;
  allImages: LightboxImage[];
  onImageClick: (url: string) => void;
}

type Orientation = "portrait" | "landscape";

export const WorkMedia = ({
  work,
  allImages,
  onImageClick,
}: WorkMediaProps) => {
  const { t } = useTranslation("website");
  const [orientations, setOrientations] = useState<Record<number, Orientation>>(
    {},
  );

  const gridImages = buildGridImages(work, allImages);

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
      {gridImages.map((img, i) => (
        <button
          key={`${img.url}-${i}`}
          type="button"
          onClick={() => onImageClick(img.url)}
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
      ))}
    </div>
  );
};

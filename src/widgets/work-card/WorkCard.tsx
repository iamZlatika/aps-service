import "./work-card.css";

import { type Work } from "@/entities/work/types";
import { cn } from "@/shared/lib/utils";
import { Lightbox } from "@/widgets/lightbox";
import { useWorkGallery } from "@/widgets/work-card/useWorkGallery";

import { WorkInfo } from "./WorkInfo";
import { WorkMedia } from "./WorkMedia";

interface WorkCardProps {
  work: Work;
  isReverse: boolean;
}

export const WorkCard = ({ work, isReverse }: WorkCardProps) => {
  const { allImages, lightboxIndex, openLightbox, closeLightbox } =
    useWorkGallery(work);

  return (
    <article
      className={cn("ws-work-card", isReverse && "ws-work-card-reverse")}
    >
      <WorkMedia
        work={work}
        allImages={allImages}
        onImageClick={openLightbox}
      />
      <WorkInfo work={work} onImageClick={openLightbox} />

      {lightboxIndex !== null && (
        <Lightbox
          images={allImages}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </article>
  );
};

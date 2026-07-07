import { useState } from "react";
import { useTranslation } from "react-i18next";

import { type Work } from "@/entities/work/types";
import { type LightboxImage } from "@/widgets/lightbox/utils";
import {
  buildLightboxImages,
  type PhotoLabels,
} from "@/widgets/work-card/photoGallery";

type WorkGallery = {
  allImages: LightboxImage[];
  lightboxIndex: number | null;
  openLightbox: (url: string) => void;
  closeLightbox: () => void;
};

export const useWorkGallery = (work: Work): WorkGallery => {
  const { t } = useTranslation("website");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const labels: PhotoLabels = {
    before: t("works.tagBefore"),
    after: t("works.tagAfter"),
    upgrade: t("works.tagUpgrade"),
  };

  const allImages = buildLightboxImages(work, labels);

  const openLightbox = (url: string): void => {
    const index = allImages.findIndex((img) => img.url === url);
    setLightboxIndex(index >= 0 ? index : 0);
  };

  const closeLightbox = (): void => setLightboxIndex(null);

  return { allImages, lightboxIndex, openLightbox, closeLightbox };
};

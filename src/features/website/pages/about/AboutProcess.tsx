import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Lightbox } from "@/widgets/lightbox";

import { ABOUT_PROCESS_IMAGES } from "./AboutPageData";

const lightboxImages = ABOUT_PROCESS_IMAGES.map((url) => ({ url }));

export const AboutProcess = () => {
  const { t } = useTranslation("website");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="mb-2 grid grid-cols-4 gap-3 max-[880px]:grid-cols-2">
        {ABOUT_PROCESS_IMAGES.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`${t("about.processLabel")} ${i + 1}`}
            onClick={() => setLightboxIndex(i)}
            className="relative aspect-[3/4] cursor-zoom-in overflow-hidden rounded-[14px] border border-ws-line bg-ws-bg-2"
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="block h-full w-full object-cover transition-transform duration-300 hover:scale-[1.04]"
            />
          </button>
        ))}
      </div>
      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
};

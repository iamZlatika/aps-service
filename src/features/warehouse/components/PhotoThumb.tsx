import { ImageOff } from "lucide-react";
import { type MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { PhotoLightbox } from "@/features/warehouse/components/PhotoLightbox.tsx";
import { cn } from "@/shared/lib/utils.ts";

interface PhotoThumbProps {
  url: string | null;
  alt: string;
  className?: string;
}

const FRAME_CLASS =
  "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted";

// Thumbs sit in clickable table rows, and React bubbles clicks from the
// lightbox portal through the component tree — keep them away from the row.
const stopPropagation = (e: MouseEvent) => e.stopPropagation();

/** `url` is the full file, not a thumbnail — a click opens it full size. */
export const PhotoThumb = ({ url, alt, className }: PhotoThumbProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  if (!url) {
    return (
      <div className={cn(FRAME_CLASS, className)}>
        <ImageOff className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <span className="contents" onClick={stopPropagation}>
      <button
        type="button"
        title={t("warehouse.photo.open")}
        aria-label={t("warehouse.photo.open")}
        className={cn(FRAME_CLASS, "cursor-zoom-in", className)}
        onClick={() => setIsOpen(true)}
      >
        <img src={url} alt={alt} className="h-full w-full object-cover" />
      </button>
      {isOpen && (
        <PhotoLightbox url={url} alt={alt} onClose={() => setIsOpen(false)} />
      )}
    </span>
  );
};

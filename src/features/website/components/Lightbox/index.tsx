import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useScrollLock } from "@/shared/hooks/useScrollLock";
import { cn } from "@/shared/lib/utils";

import { getTagClass, type LightboxImage } from "./utils";

interface LightboxProps {
  images: LightboxImage[];
  initialIndex: number;
  onClose: () => void;
}

export const Lightbox = ({ images, initialIndex, onClose }: LightboxProps) => {
  const { t } = useTranslation("website");
  const [index, setIndex] = useState(initialIndex);

  useScrollLock();

  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;
  const current = images[index];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) setIndex((i) => i - 1);
      if (e.key === "ArrowRight" && hasNext) setIndex((i) => i + 1);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, hasPrev, hasNext]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("works.lightboxTitle")}
      className="fixed inset-0 z-[300] flex items-center justify-center p-10 max-sm:p-4"
    >
      <div
        className="absolute inset-0 bg-[rgba(8,6,4,.85)] backdrop-blur-[10px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={onClose}
        aria-label={t("works.lightboxClose")}
        className="absolute right-[22px] top-[22px] z-10 flex size-11 items-center justify-center rounded-[12px] border border-ws-line bg-[color-mix(in_oklab,var(--ws-bg-2)_70%,transparent)] text-ws-ink backdrop-blur-[8px] transition-colors hover:border-ws-ink-mute max-sm:right-3 max-sm:top-3"
      >
        <X className="size-[18px]" />
      </button>

      {hasPrev && (
        <button
          type="button"
          onClick={() => setIndex((i) => i - 1)}
          aria-label={t("works.lightboxPrev")}
          className="absolute left-[22px] top-1/2 z-10 flex size-[52px] -translate-y-1/2 items-center justify-center rounded-full border border-ws-line bg-[color-mix(in_oklab,var(--ws-bg-2)_70%,transparent)] text-ws-ink backdrop-blur-[8px] transition-colors hover:border-ws-ember hover:text-ws-ember-bright max-sm:left-[10px] max-sm:size-11"
        >
          <ChevronLeft className="size-[22px]" />
        </button>
      )}

      {hasNext && (
        <button
          type="button"
          onClick={() => setIndex((i) => i + 1)}
          aria-label={t("works.lightboxNext")}
          className="absolute right-[22px] top-1/2 z-10 flex size-[52px] -translate-y-1/2 items-center justify-center rounded-full border border-ws-line bg-[color-mix(in_oklab,var(--ws-bg-2)_70%,transparent)] text-ws-ink backdrop-blur-[8px] transition-colors hover:border-ws-ember hover:text-ws-ember-bright max-sm:right-[10px] max-sm:size-11"
        >
          <ChevronRight className="size-[22px]" />
        </button>
      )}

      <figure className="relative z-[2] flex max-h-[86vh] max-w-[90vw] flex-col items-center gap-3.5">
        <img
          key={current?.url}
          src={current?.url}
          alt={current?.tag ?? ""}
          className="block max-h-[78vh] max-w-[90vw] rounded-[14px] object-contain shadow-[0_40px_90px_-30px_rgba(0,0,0,.8)]"
        />
        {(current?.tag || images.length > 1) && (
          <figcaption className="flex items-center gap-3.5 text-[13px] text-ws-ink-soft">
            {current?.tag && (
              <span
                className={cn(
                  "rounded-full px-3 py-[5px] text-[11px] font-bold uppercase tracking-[0.1em]",
                  getTagClass(current.tagVariant),
                )}
              >
                {current.tag}
              </span>
            )}
            {images.length > 1 && (
              <span className="tabular-nums tracking-[0.04em] text-ws-ink-mute">
                {index + 1} / {images.length}
              </span>
            )}
          </figcaption>
        )}
      </figure>
    </div>
  );
};

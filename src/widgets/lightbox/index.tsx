import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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

  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;
  const current = images[index];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && hasPrev) setIndex((i) => i - 1);
      if (e.key === "ArrowRight" && hasNext) setIndex((i) => i + 1);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [hasPrev, hasNext]);

  return (
    <DialogPrimitive.Root open onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[400] bg-[rgba(8,6,4,.85)] backdrop-blur-[10px]" />
        <DialogPrimitive.Content
          aria-label={t("works.lightboxTitle")}
          className="ws-theme-dark fixed inset-0 z-[400] flex items-center justify-center p-10 focus:outline-none max-sm:p-4"
          onClick={onClose}
        >
          <DialogPrimitive.Title className="sr-only">
            {t("works.lightboxTitle")}
          </DialogPrimitive.Title>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("works.lightboxClose")}
            className="absolute right-[22px] top-[22px] z-10 hidden size-11 items-center justify-center rounded-[12px] border border-ws-line bg-[color-mix(in_oklab,var(--ws-bg-2)_70%,transparent)] text-ws-ink backdrop-blur-[8px] transition-colors hover:border-ws-ink-mute max-sm:right-3 max-sm:top-3 max-sm:flex"
          >
            <X className="size-[18px]" />
          </button>

          {hasPrev && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIndex((i) => i - 1);
              }}
              aria-label={t("works.lightboxPrev")}
              className="absolute left-[22px] top-1/2 z-10 flex size-[52px] -translate-y-1/2 items-center justify-center rounded-full border border-ws-line bg-[color-mix(in_oklab,var(--ws-bg-2)_70%,transparent)] text-ws-ink backdrop-blur-[8px] transition-colors hover:border-ws-ember hover:text-ws-ember-bright max-sm:left-[10px] max-sm:size-11"
            >
              <ChevronLeft className="size-[22px]" />
            </button>
          )}

          {hasNext && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIndex((i) => i + 1);
              }}
              aria-label={t("works.lightboxNext")}
              className="absolute right-[22px] top-1/2 z-10 flex size-[52px] -translate-y-1/2 items-center justify-center rounded-full border border-ws-line bg-[color-mix(in_oklab,var(--ws-bg-2)_70%,transparent)] text-ws-ink backdrop-blur-[8px] transition-colors hover:border-ws-ember hover:text-ws-ember-bright max-sm:right-[10px] max-sm:size-11"
            >
              <ChevronRight className="size-[22px]" />
            </button>
          )}

          <figure
            className="relative flex max-h-full max-w-full flex-col items-center gap-3.5"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              key={current?.url}
              src={current?.url}
              alt={current?.tag ?? ""}
              className="block max-h-[85vh] max-w-[90vw] rounded-[14px] object-contain shadow-[0_40px_90px_-30px_rgba(0,0,0,.8)]"
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
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

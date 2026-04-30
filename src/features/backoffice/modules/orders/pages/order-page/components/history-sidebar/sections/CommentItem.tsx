import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Download, X } from "lucide-react";
import { memo } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useDownloadImage } from "@/features/backoffice/modules/orders/pages/order-page/components/history-sidebar/hooks/useDownloadImage.ts";
import { HistoryItemWrapper } from "@/features/backoffice/modules/orders/pages/order-page/components/history-sidebar/sections/HistoryItemWrapper.tsx";
import type { HistoryComment } from "@/features/backoffice/modules/orders/pages/order-page/types.ts";

interface CommentItemProps {
  item: HistoryComment;
}

export const CommentItem = memo(({ item }: CommentItemProps) => {
  const { t } = useTranslation();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { download, isPending: isDownloading } = useDownloadImage();

  const userName = item.user?.name ?? "—";
  const image = item.image;

  return (
    <HistoryItemWrapper date={item.date}>
      {item.text && (
        <>
          <div className="flex flex-wrap items-center gap-1 mb-2">
            <span className="font-medium">— {userName} —</span>
            <span className="text-muted-foreground">
              {t("orders.history.comment.addedText")}
            </span>
          </div>
          <blockquote className="border-l-2 border-muted-foreground/40 pl-3 text-muted-foreground italic">
            {item.text}
          </blockquote>
        </>
      )}
      {image && (
        <>
          <div className="flex flex-wrap items-center gap-1 mb-2 mt-2">
            <span className="font-medium">— {userName} —</span>
            <span className="text-muted-foreground">
              {t("orders.history.comment.addedPhoto")}
            </span>
          </div>
          <img
            src={image}
            alt=""
            className="h-24 w-24 rounded-md object-cover border cursor-pointer"
            onClick={() => setLightboxOpen(true)}
          />

          <DialogPrimitive.Root
            open={lightboxOpen}
            onOpenChange={setLightboxOpen}
          >
            <DialogPrimitive.Portal>
              <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/85 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <DialogPrimitive.Content
                className="fixed inset-0 z-50 flex items-center justify-center p-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
                onClick={() => setLightboxOpen(false)}
              >
                <DialogPrimitive.Title className="sr-only">
                  {t("orders.history.comment.addedPhoto")}
                </DialogPrimitive.Title>
                <img
                  src={image}
                  alt=""
                  className="max-h-full max-w-full object-contain rounded-md"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="absolute right-4 top-4 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isDownloading}
                    onClick={(e) => {
                      e.stopPropagation();
                      download(image);
                    }}
                    className="rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors disabled:opacity-50"
                  >
                    <Download className="h-8 w-8" />
                  </button>
                  <DialogPrimitive.Close className="rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors">
                    <X className="h-8 w-8" />
                  </DialogPrimitive.Close>
                </div>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>
        </>
      )}
    </HistoryItemWrapper>
  );
});

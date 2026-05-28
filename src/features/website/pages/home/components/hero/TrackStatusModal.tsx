import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { type OrderPreview } from "@/features/website/types";
import { cn } from "@/shared/lib/utils";

import { TrackStatusModalForm } from "./TrackStatusModalForm";
import { TrackStatusModalResult } from "./TrackStatusModalResult";

interface TrackStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackStatusModal = ({
  isOpen,
  onClose,
}: TrackStatusModalProps) => {
  const { t } = useTranslation("website");
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [orderPreview, setOrderPreview] = useState<OrderPreview | null>(null);

  useEffect(() => {
    setContainer(document.querySelector<HTMLElement>(".website"));
  }, []);

  const handleClose = () => {
    setOrderPreview(null);
    onClose();
  };

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogPrimitive.Portal container={container ?? undefined}>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[200] bg-[rgba(8,6,4,.55)] backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <DialogPrimitive.Content
          aria-labelledby="track-modal-title"
          className={cn(
            "fixed z-[201] flex flex-col",
            "w-[calc(100%-40px)]",
            orderPreview ? "max-w-[600px]" : "max-w-[520px]",
            "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "max-h-[calc(100vh-40px)] overflow-hidden",
            "rounded-[20px]",
            "border border-ws-line bg-ws-bg-2",
            "px-8 pb-[26px] pt-[34px] max-sm:px-[22px]",
            "shadow-[0_50px_100px_-30px_rgba(0,0,0,.7)]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=open]:zoom-in-95",
          )}
        >
          <DialogPrimitive.Title id="track-modal-title" className="sr-only">
            {orderPreview ? orderPreview.orderNumber : t("trackModal.title")}
          </DialogPrimitive.Title>

          <DialogPrimitive.Close className="absolute right-3.5 top-3.5 flex size-[34px] items-center justify-center rounded-[10px] border border-ws-line text-ws-ink-soft transition-colors hover:border-ws-ink-mute hover:text-ws-ink">
            <X className="size-3.5" />
            <span className="sr-only">{t("trackModal.close")}</span>
          </DialogPrimitive.Close>

          {orderPreview ? (
            <TrackStatusModalResult data={orderPreview} onClose={handleClose} />
          ) : (
            <TrackStatusModalForm
              onSuccess={setOrderPreview}
              onClose={handleClose}
            />
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

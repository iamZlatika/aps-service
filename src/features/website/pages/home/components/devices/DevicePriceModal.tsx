import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/shared/lib/utils";

import { type DeviceId } from "./DevicesData";

interface DevicePriceModalProps {
  deviceId: DeviceId | null;
  onClose: () => void;
}

export const DevicePriceModal = ({
  deviceId,
  onClose,
}: DevicePriceModalProps) => {
  const { t } = useTranslation("website");
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(document.querySelector<HTMLElement>(".website"));
  }, []);

  return (
    <DialogPrimitive.Root
      open={deviceId !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogPrimitive.Portal container={container ?? undefined}>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[200] bg-[rgba(8,6,4,.55)] backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <DialogPrimitive.Content
          aria-labelledby="price-modal-title"
          className={cn(
            "fixed z-[201] flex flex-col",
            "w-[calc(100%-40px)] max-w-[760px]",
            "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "max-h-[calc(100vh-40px)]",
            "rounded-[20px]",
            "border border-ws-line bg-ws-bg-2",
            "shadow-[0_50px_100px_-30px_rgba(0,0,0,.7)]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=open]:zoom-in-95",
          )}
        >
          <DialogPrimitive.Title
            id="price-modal-title"
            className="flex-shrink-0 px-8 pb-4 pt-[34px] text-ws-xl font-semibold tracking-tight text-ws-ink max-sm:px-[22px]"
          >
            {deviceId && t(`devices.items.${deviceId}.name`)}
          </DialogPrimitive.Title>

          <DialogPrimitive.Close className="absolute right-3.5 top-3.5 flex size-[34px] items-center justify-center rounded-[10px] border border-ws-line text-ws-ink-soft transition-colors hover:border-ws-ink-mute hover:text-ws-ink">
            <X className="size-3.5" />
            <span className="sr-only">{t("trackModal.close")}</span>
          </DialogPrimitive.Close>

          <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-[26px] max-sm:px-[22px]">
            {/* price list content goes here */}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

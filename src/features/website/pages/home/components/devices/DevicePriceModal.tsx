import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/shared/lib/utils";

import { DevicePriceModalContent } from "./DevicePriceModalContent";
import { type DeviceId, DEVICES } from "./DevicesData";
import { OtherDeviceModalContent } from "./OtherDeviceModalContent";

interface DevicePriceModalProps {
  deviceId: DeviceId | null;
  onClose: () => void;
}

const PriceListSkeleton = () => (
  <div className="flex flex-col gap-3 px-7 py-6 max-sm:px-5">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex items-center justify-between py-2">
        <div className="h-4 w-2/3 animate-pulse rounded bg-ws-bg-3" />
        <div className="h-4 w-16 animate-pulse rounded bg-ws-bg-3" />
      </div>
    ))}
  </div>
);

export const DevicePriceModal = ({
  deviceId,
  onClose,
}: DevicePriceModalProps) => {
  const { t } = useTranslation("website");
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(document.querySelector<HTMLElement>(".website"));
  }, []);

  const device = DEVICES.find((d) => d.id === deviceId);
  const categories = device?.categories ?? ([] as const);

  return (
    <DialogPrimitive.Root
      open={deviceId !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogPrimitive.Portal container={container ?? undefined}>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[200] bg-[rgba(8,6,4,.55)] backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            "fixed z-[201] flex flex-col",
            "w-[calc(100%-40px)] max-w-[860px]",
            "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "max-h-[calc(100vh-40px)]",
            "max-sm:left-0 max-sm:top-0 max-sm:h-screen max-sm:max-h-screen max-sm:w-screen max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0",
            "rounded-[22px] max-sm:rounded-none",
            "border border-ws-line bg-ws-bg-2",
            "shadow-[0_50px_110px_-30px_rgba(0,0,0,.7)]",
            "overflow-hidden",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=open]:zoom-in-95",
          )}
        >
          <DialogPrimitive.Title className="sr-only">
            {deviceId && t(`devices.items.${deviceId}.name`)}
          </DialogPrimitive.Title>

          <DialogPrimitive.Close className="absolute right-[18px] top-[18px] z-10 flex size-[36px] items-center justify-center rounded-[10px] border border-ws-line text-ws-ink-soft transition-colors hover:border-ws-ink-mute hover:text-ws-ink">
            <X className="size-[15px]" />
            <span className="sr-only">{t("priceModal.close")}</span>
          </DialogPrimitive.Close>

          {deviceId !== null && (
            <Suspense fallback={<PriceListSkeleton />}>
              {categories.length === 0 ? (
                <OtherDeviceModalContent deviceId={deviceId} />
              ) : (
                <DevicePriceModalContent
                  deviceId={deviceId}
                  categories={categories}
                />
              )}
            </Suspense>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

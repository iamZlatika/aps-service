import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

import { WebsiteModal } from "@/features/website/components/WebsiteModal";

import { DevicePriceModalContent } from "./DevicePriceModalContent";
import { type DeviceId, DEVICES } from "./DevicesData";
import { OtherDeviceModalContent } from "./OtherDeviceModalContent";

interface DevicePriceModalProps {
  deviceId: DeviceId | null;
  onClose: () => void;
}

const PriceListSkeleton = ({ title }: { title: string }) => (
  <div className="flex flex-col gap-3 px-7 py-6 max-sm:px-5">
    <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
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
  const device = DEVICES.find((d) => d.id === deviceId);
  const categories = device?.categories ?? ([] as readonly string[]);
  const title = deviceId ? t(`devices.items.${deviceId}.name`) : "";

  return (
    <WebsiteModal
      open={deviceId !== null}
      onClose={onClose}
      maxWidth="max-w-[860px]"
    >
      {deviceId !== null && (
        <Suspense fallback={<PriceListSkeleton title={title} />}>
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
    </WebsiteModal>
  );
};

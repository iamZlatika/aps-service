import { useTranslation } from "react-i18next";

import {
  DEVICE_IMAGES,
  type DeviceId,
} from "@/features/website/pages/home/components/devices/DevicesData";

interface DeviceCardProps {
  id: DeviceId;
}

export const DeviceCard = ({ id }: DeviceCardProps) => {
  const { t } = useTranslation("website");
  const image = DEVICE_IMAGES[id];

  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-ws-card border border-ws-line bg-ws-bg-2 p-[0.8rem] transition-all duration-300 md:p-5 md:hover:-translate-y-1 md:hover:border-ws-ember md:hover:bg-ws-bg-3">
      <div className="aspect-square w-full overflow-hidden rounded-ws-md">
        <img
          src={image}
          alt={t(`devices.items.${id}.name`)}
          className="ws-device-img size-full object-cover"
          loading="lazy"
        />
      </div>

      <h3 className="text-ws-lg font-semibold leading-tight tracking-[-0.01em] text-ws-ink">
        {t(`devices.items.${id}.name`)}
      </h3>

      <p className="hidden text-ws-xs leading-[1.45] text-ws-ink-soft md:block">
        {t(`devices.items.${id}.description`)}
      </p>

      <div className="mt-auto flex items-baseline justify-between border-t border-ws-line-soft pt-3.5">
        <span className="text-ws-2xs uppercase tracking-[0.1em] text-ws-ink-mute">
          {t("devices.from")}
        </span>
        <b className="text-ws-md font-semibold text-ws-cream">
          {t(`devices.items.${id}.price`)}
        </b>
      </div>
    </div>
  );
};

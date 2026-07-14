import { useTranslation } from "react-i18next";

import { DEVICE_ICONS } from "@/features/website/components/DeviceIcons";
import { formatPrice } from "@/features/website/lib/service";
import { type DeviceId } from "@/features/website/pages/home/components/devices/DevicesData";

interface DeviceCardProps {
  id: DeviceId;
  onClick?: () => void;
  minPrice?: number | null;
}

export const DeviceCard = ({ id, onClick, minPrice }: DeviceCardProps) => {
  const { t } = useTranslation("website");
  const isOther = id === "other";

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-full flex-col gap-4 overflow-hidden rounded-ws-card border border-ws-line bg-ws-bg-2 p-5 text-left transition-all duration-300 md:hover:-translate-y-1 md:hover:border-ws-ember md:hover:bg-ws-bg-3"
    >
      <div
        aria-hidden="true"
        className="absolute right-5 top-5 flex size-[30px] -translate-x-1.5 translate-y-1.5 items-center justify-center rounded-full bg-ws-ember text-[13px] font-bold text-ws-btn-text opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
      >
        →
      </div>

      <div className="ws-device-icon-bg flex aspect-square items-center justify-center overflow-hidden rounded-ws-md border border-ws-line">
        <div className="w-[64%]">{DEVICE_ICONS[id]}</div>
      </div>

      <h3 className="flex min-h-[3.6em] items-start text-ws-lg font-semibold leading-tight tracking-[-0.01em] text-ws-ink">
        {t(`devices.items.${id}.name`)}
      </h3>

      <p className="hidden text-ws-xs leading-[1.45] text-ws-ink-soft md:block">
        {t(`devices.items.${id}.description`)}
      </p>

      <div className="mt-auto flex items-baseline justify-between border-t border-ws-line-soft pt-3.5">
        <span className="text-ws-2xs uppercase tracking-[0.1em] text-ws-ink-mute">
          {isOther ? t("devices.priceOnDemand") : t("devices.from")}
        </span>
        <b className="text-ws-md font-semibold text-ws-cream">
          {isOther
            ? t(`devices.items.${id}.price`)
            : minPrice != null
              ? formatPrice(minPrice)
              : t(`devices.items.${id}.price`)}
          {!isOther && (
            <span className="ml-1 align-middle text-[20px] font-bold leading-none text-ws-ember-bright">
              *
            </span>
          )}
        </b>
      </div>
    </button>
  );
};

import { useTranslation } from "react-i18next";

import { useLanding } from "@/features/website/hooks/useLanding";
import { useModalParam } from "@/features/website/hooks/useModalParam";
import { DEVICE_PARAM } from "@/features/website/lib/modalParams";
import { DeviceCard } from "@/features/website/pages/home/components/devices/DeviceCard";
import { DevicePriceModal } from "@/features/website/pages/home/components/devices/DevicePriceModal";
import {
  type DeviceId,
  DEVICES,
} from "@/features/website/pages/home/components/devices/DevicesData";
import { findCheapestCategory } from "@/features/website/pages/home/components/devices/service";

export const DevicesSection = () => {
  const { t } = useTranslation("website");
  const {
    value: deviceParam,
    set: setDevice,
    clear: clearDevice,
  } = useModalParam(DEVICE_PARAM);
  const { landing } = useLanding();

  const selectedId = DEVICES.some((d) => d.id === deviceParam)
    ? (deviceParam as DeviceId)
    : null;

  return (
    <>
      <section className="ws-section">
        <div className="ws-wrap">
          <div className="ws-section-head flex-col max-sm:!items-start md:flex-row md:items-end">
            <div>
              <p className="ws-section-eyebrow">{t("devices.eyebrow")}</p>
              <h2 className="ws-section-title max-sm:!text-[clamp(20px,5.8vw,26px)]">
                {t("devices.title")}
                <br />
                <strong>{t("devices.titleBold")}</strong>
              </h2>
            </div>
            <p className="ws-section-side hidden md:block">
              {t("devices.description")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7">
            {DEVICES.map(({ id, categories }) => {
              const cheapest = landing
                ? findCheapestCategory(categories, landing.prices)
                : null;
              return (
                <DeviceCard
                  key={id}
                  id={id}
                  minPrice={cheapest?.minPrice ?? null}
                  onClick={() => setDevice(id)}
                />
              );
            })}
            <div className="md:hidden flex flex-col gap-3 rounded-ws-card border border-dashed border-ws-line p-5 text-[12.5px] leading-[1.55] tracking-[.005em] text-ws-ember-bright">
              <b className="text-[22px] font-bold leading-none text-ws-ember-bright">
                *
              </b>
              <p>{t("devices.note1")}</p>
              <p>{t("devices.note2")}</p>
            </div>
          </div>

          <p className="hidden md:block mt-[18px] rounded-xl border border-dashed border-ws-line bg-white/[.012] px-[22px] py-4 text-[13px] leading-[1.55] tracking-[.005em] text-ws-ember-bright">
            <b className="mr-1.5 align-middle text-[20px] font-bold leading-none text-ws-ember-bright">
              *
            </b>
            {t("devices.note1")} {t("devices.note2")}
          </p>
        </div>
      </section>

      <DevicePriceModal deviceId={selectedId} onClose={clearDevice} />
    </>
  );
};

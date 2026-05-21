import { useTranslation } from "react-i18next";

import { DeviceCard } from "@/features/website/pages/home/components/devices/DeviceCard";
import { DEVICES } from "@/features/website/pages/home/components/devices/DevicesData";

export const DevicesSection = () => {
  const { t } = useTranslation("website");

  return (
    <section className="ws-section">
      <div className="ws-wrap">
        <div className="ws-section-head flex-col items-start md:flex-row md:items-end">
          <div>
            <p className="ws-section-eyebrow">{t("devices.eyebrow")}</p>
            <h2 className="ws-section-title">
              {t("devices.title")}
              <br />
              <strong>{t("devices.titleBold")}</strong>
            </h2>
          </div>
          <p className="ws-section-side">{t("devices.description")}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7">
          {DEVICES.map(({ id }) => (
            <DeviceCard key={id} id={id} />
          ))}
        </div>
      </div>
    </section>
  );
};

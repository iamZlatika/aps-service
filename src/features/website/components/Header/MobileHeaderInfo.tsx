import { useTranslation } from "react-i18next";

import { HeaderCabinetButton } from "@/features/website/components/Header/HeaderCabinetButton";
import { PinIcon } from "@/features/website/components/icons/PinIcon";
import { CONTACTS } from "@/features/website/config";

export const MobileHeaderInfo = () => {
  const { t } = useTranslation("website");

  return (
    <div className="md:hidden">
      <div className="pt-[14px] pb-4">
        <HeaderCabinetButton className="w-full" />
      </div>

      <div className="grid grid-cols-2 gap-2 pb-4">
        {CONTACTS.map((c) => (
          <a
            key={c.phone}
            href={c.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-[6px] rounded-[11px] border border-ws-line bg-white/[0.015] px-3 py-[11px] no-underline transition-colors duration-200 hover:border-ws-ember"
          >
            <div className="flex items-center gap-1.5">
              <PinIcon className="size-3 shrink-0 text-ws-ember-bright" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ws-ink-mute">
                {t("nav.streetLabel")}
              </span>
            </div>
            <div className="text-ws-sm font-semibold leading-[1.2] text-ws-ink">
              {t(c.shortAddressKey)}
            </div>
            <div className="text-[8.5px] font-semibold uppercase tracking-[0.14em] text-ws-ink-mute">
              {t(c.areaKey)}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

import { useTranslation } from "react-i18next";

import { HeaderCabinetButton } from "@/features/website/components/Header/HeaderCabinetButton";
import { MESSENGER_ICONS } from "@/features/website/components/Header/HeaderData";
import { PhoneIcon } from "@/features/website/components/icons/PhoneIcon";
import { PinIcon } from "@/features/website/components/icons/PinIcon";
import { MESSENGERS } from "@/features/website/config";
import { useLocations } from "@/features/website/hooks/useLocations";
import {
  getLocalized,
  getMapsUrl,
  getMessengerHref,
} from "@/features/website/lib/service";
const MOBILE_MESSENGER_ORDER = ["telegram", "whatsapp", "viber"] as const;

export const MobileHeaderInfo = () => {
  const { t, i18n } = useTranslation("website");
  const { locations } = useLocations();
  const isRu = i18n.language === "ru";

  return (
    <div className="md:hidden">
      <div className="pb-4 pt-[14px]">
        <HeaderCabinetButton className="w-full" />
      </div>

      <div className="grid grid-cols-2 gap-2 pb-4">
        {locations.map((location) => {
          const street = getLocalized(
            isRu,
            location.streetRu,
            location.streetUa,
          );
          const district = getLocalized(
            isRu,
            location.districtRu,
            location.districtUa,
          );
          const address = getLocalized(
            isRu,
            location.addressRu,
            location.addressUa,
          );

          return (
            <div
              key={location.id}
              className="ws-loc-card flex flex-col gap-[11px] rounded-ws-sm border border-ws-line px-[11px] pb-[9px] pt-[11px]"
            >
              <a
                href={getMapsUrl(address)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 no-underline"
              >
                <PinIcon className="mt-[3px] size-3.5 shrink-0 text-ws-ember-bright" />
                <div>
                  <div className="mb-[3px]">
                    <span className="mb-[2px] block text-ws-2xs font-medium lowercase tracking-[0.02em] text-ws-ink-soft">
                      {t("nav.streetLabel")}
                    </span>
                    <span className="text-ws-sm font-semibold leading-[1.2] tracking-[-0.005em] text-ws-ink">
                      {street}, {location.building}
                    </span>
                  </div>
                  <div className="text-[8.5px] font-semibold uppercase tracking-[0.14em] text-ws-ink-mute">
                    {district} мкр-н
                  </div>
                </div>
              </a>

              <div className="grid grid-cols-4 gap-[5px] border-t border-ws-line-soft pt-2">
                <a
                  href={`tel:${location.phone}`}
                  aria-label={t("nav.call")}
                  className="flex h-ws-ctrl items-center justify-center rounded-ws-ctrl bg-gradient-to-b from-ws-ember-bright to-ws-ember text-white transition-opacity duration-150 active:opacity-80"
                >
                  <PhoneIcon className="size-[15px]" />
                </a>
                {MOBILE_MESSENGER_ORDER.map((key) => {
                  const m = MESSENGERS.find((m) => m.key === key);
                  if (!m) return null;
                  const Icon = MESSENGER_ICONS[key];
                  const href = getMessengerHref(key, location.phone, m.href);
                  return (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(`messenger.${key}`)}
                      className="ws-loc-act-btn flex h-ws-ctrl items-center justify-center rounded-ws-ctrl text-ws-ink-soft transition-all duration-150 active:scale-[.94]"
                    >
                      <Icon className="size-[15px]" />
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

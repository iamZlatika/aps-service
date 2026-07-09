import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { PhoneIcon } from "@/features/website/components/icons/PhoneIcon";
import { PinIcon } from "@/features/website/components/icons/PinIcon";
import { MESSENGER_ICONS } from "@/features/website/config";
import { useLocations } from "@/features/website/hooks/useLocations";
import { getMapsUrl, getMessengerHref } from "@/features/website/lib/service";
import { WEBSITE_ROUTES } from "@/features/website/routes";
import { useLocalize } from "@/shared/hooks/useLocalize";

const MOBILE_MESSENGER_ORDER = ["telegram", "whatsapp", "viber"] as const;

export const MobileLocationCards = () => {
  const { t } = useTranslation("website");
  const { locations } = useLocations();
  const localize = useLocalize();
  const { pathname } = useLocation();

  const isContacts = pathname === WEBSITE_ROUTES.contacts;

  if (isContacts) return null;

  return (
    <div className="grid grid-cols-2 gap-2 pb-3 md:hidden">
      {locations.map((location) => {
        const street = localize(location.streetRu, location.streetUa);
        const district = localize(location.districtRu, location.districtUa);
        const address = localize(location.addressRu, location.addressUa);

        return (
          <div
            key={location.id}
            className="ws-loc-card flex flex-col gap-[11px] rounded-ws-sm border border-ws-line px-[11px] pb-[9px] pt-[11px]"
          >
            <a
              href={getMapsUrl(address)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col no-underline"
            >
              <div className="mb-[2px] flex items-center gap-1">
                <PinIcon className="size-3.5 shrink-0 text-ws-ember-bright" />
                <span className="text-ws-2xs font-medium lowercase tracking-[0.02em] text-ws-ink-soft">
                  {t("nav.streetLabel")}
                </span>
              </div>
              <span className="mb-[3px] text-ws-sm font-semibold leading-[1.2] tracking-[-0.005em] text-ws-ink">
                {street}, {location.building}
              </span>
              <div className="text-[8.5px] font-semibold uppercase tracking-[0.14em] text-ws-ink-mute">
                {district} мкр-н
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
                const Icon = MESSENGER_ICONS[key];
                const href = getMessengerHref(key, location.phone);
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
  );
};

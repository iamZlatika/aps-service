import { useTranslation } from "react-i18next";

import { MESSENGER_ICONS } from "@/features/website/components/Header/HeaderData";
import { CopyIcon } from "@/features/website/components/icons/CopyIcon";
import { ExternalLinkIcon } from "@/features/website/components/icons/ExternalLinkIcon";
import { PhoneIcon } from "@/features/website/components/icons/PhoneIcon";
import { MessengerLabelButton } from "@/features/website/components/MessengerLabelButton";
import { MESSENGERS } from "@/features/website/config";
import {
  formatPhone,
  getMapEmbedSrc,
  getMapsUrl,
  getMessengerHref,
  parseScheduleLines,
} from "@/features/website/lib/service";
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard";
import { useLocalize } from "@/shared/hooks/useLocalize";
import { useIsMobile } from "@/shared/hooks/useMobile";
import { cn } from "@/shared/lib/utils";
import { type Location } from "@/shared/types";

interface OfficeCardProps {
  location: Location;
  index: number;
}

export const OfficeCard = ({ location, index }: OfficeCardProps) => {
  const { t } = useTranslation("website");
  const localize = useLocalize();
  const { copied, copy } = useCopyToClipboard();
  const isMobile = useIsMobile(880);

  const reverse = index % 2 !== 0;
  const street = localize(location.streetRu, location.streetUa);
  const district = localize(location.districtRu, location.districtUa);
  const city = localize(location.cityRu, location.cityUa);
  const address = localize(location.addressRu, location.addressUa);
  const formattedPhone = formatPhone(location.phone);
  const mapSrc = getMapEmbedSrc(address);
  const scheduleLines = parseScheduleLines(location.scheduleDisplay);
  const cardNum = String(index + 1).padStart(2, "0");

  return (
    <div
      className={cn(
        "ws-contacts-office",
        reverse && "ws-contacts-office-reverse",
      )}
    >
      <div className="ws-contacts-info flex flex-col gap-[22px] min-w-0 relative">
        <span
          aria-hidden="true"
          className="ws-contacts-num absolute top-[-10px] right-[24px] text-[72px] font-[200] leading-none tracking-[-0.04em] pointer-events-none select-none tabular-nums"
        >
          {cardNum}
        </span>
        <span className="text-ws-sm uppercase tracking-[0.14em] font-semibold text-ws-ember-bright">
          {t("contacts.serviceCenter")} {street}
        </span>
        <div>
          <span className="block text-ws-sm font-medium text-ws-ink-soft lowercase mb-1.5 tracking-[0.005em]">
            {t("nav.streetLabel")}
          </span>
          <div className="text-[clamp(20px,2.2vw,28px)] font-light leading-[1.05] tracking-[-0.02em] text-ws-ink">
            {street},{" "}
            <span className="font-semibold text-ws-cream">
              {location.building}
            </span>
          </div>
          <div className="mt-1.5 text-ws-2xs uppercase tracking-[0.16em] font-semibold text-ws-ink-mute">
            {district} мкр-н · {city}
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3 pt-3.5 border-t border-ws-line-soft pb-[18px]">
          <div>
            <dt className="text-[10.5px] uppercase tracking-[0.18em] font-semibold text-ws-ink-mute mb-2">
              {t("contacts.scheduleLabel")}
            </dt>
            <dd className="text-ws-sm text-ws-ink font-medium leading-[1.5]">
              {scheduleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-[10.5px] uppercase tracking-[0.18em] font-semibold text-ws-ink-mute mb-2">
              {t("contacts.phoneLabel")}
            </dt>
            <dd>
              {isMobile ? (
                <button
                  type="button"
                  aria-label={
                    copied
                      ? `${t("nav.copyPhone")} — ${t("contacts.copied")}`
                      : t("nav.copyPhone")
                  }
                  onClick={() => copy(location.phone)}
                  className={cn(
                    "ws-contacts-phone-tile flex flex-col items-start gap-1 w-full rounded-ws-sm border px-2.5 py-2 cursor-pointer text-left transition-colors duration-150 active:scale-[.985]",
                    copied
                      ? "border-ws-ember bg-ws-ember/[0.12]"
                      : "border-ws-line bg-white/[0.025]",
                  )}
                >
                  <span className="text-[13px] font-bold tabular-nums leading-[1.1] tracking-[-0.005em] whitespace-nowrap text-ws-ink">
                    {formattedPhone}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-[5px] text-[8.5px] uppercase tracking-[0.06em] font-semibold leading-none",
                      copied ? "text-ws-ember-bright" : "text-ws-ink-mute",
                    )}
                  >
                    <CopyIcon className="size-[10px] shrink-0" />
                    {copied ? t("contacts.copied") : t("contacts.copy")}
                  </span>
                </button>
              ) : (
                <a
                  href={`tel:${location.phone}`}
                  className="text-ws-md font-semibold text-ws-ink tabular-nums no-underline hover:text-ws-ember-bright transition-colors whitespace-nowrap"
                >
                  {formattedPhone}
                </a>
              )}
            </dd>
          </div>
        </dl>
        <div className="mt-auto flex flex-col gap-2 pt-[18px] border-t border-ws-line-soft">
          {isMobile && (
            <a
              href={`tel:${location.phone}`}
              className="flex items-center justify-center gap-2 h-[46px] rounded-ws-sm font-semibold text-ws-base no-underline active:scale-[.98] transition-transform ws-bb-btn-primary"
            >
              <PhoneIcon className="size-[15px]" />
              {t("nav.call")}
            </a>
          )}
          <div className="flex gap-2.5">
            {MESSENGERS.map((m) => {
              const Icon = MESSENGER_ICONS[m.key];
              return (
                <MessengerLabelButton
                  key={m.key}
                  href={getMessengerHref(m.key, location.phone)}
                  icon={<Icon />}
                  label={t(`messenger.${m.key}`)}
                  colorClass={cn(m.colorClass, m.hoverClass)}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="ws-contacts-map">
        <a
          href={getMapsUrl(address)}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3.5 right-3.5 z-[2] flex items-center gap-2 px-3.5 py-2.5 rounded-ws-sm border border-ws-line bg-ws-bg-2/90 backdrop-blur-[10px] text-ws-ink no-underline text-ws-xs font-semibold hover:border-ws-ember transition-colors"
        >
          <ExternalLinkIcon className="size-3.5 shrink-0" />
          {t("contacts.openMaps")}
        </a>
        <iframe
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={mapSrc}
          title={`${street}, ${location.building}`}
          className="ws-contacts-map-iframe"
        />
      </div>
    </div>
  );
};

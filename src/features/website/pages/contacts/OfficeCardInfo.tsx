import { useTranslation } from "react-i18next";

import { CopyIcon } from "@/features/website/components/icons/CopyIcon";
import { PhoneIcon } from "@/features/website/components/icons/PhoneIcon";
import { MessengerLabelButton } from "@/features/website/components/MessengerLabelButton";
import { MESSENGER_ICONS, MESSENGERS } from "@/features/website/config";
import { formatPhone, getMessengerHref } from "@/features/website/lib/service";
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard";
import { useIsMobile } from "@/shared/hooks/useMobile";
import { cn } from "@/shared/lib/utils";

interface OfficeCardInfoProps {
  street: string;
  district: string;
  city: string;
  building: string;
  phone: string;
  scheduleLines: string[];
}

export const OfficeCardInfo = ({
  street,
  district,
  city,
  building,
  phone,
  scheduleLines,
}: OfficeCardInfoProps) => {
  const { t } = useTranslation("website");
  const { copied, copy } = useCopyToClipboard();
  const isMobile = useIsMobile(880);

  const formattedPhone = formatPhone(phone);

  return (
    <div className="ws-contacts-info flex flex-col gap-[22px] min-w-0 relative">
      <span className="text-ws-sm uppercase tracking-[0.14em] font-semibold text-ws-ember-bright">
        {t("contacts.serviceCenter")} {street}
      </span>
      <div>
        <span className="block text-ws-sm font-medium text-ws-ink-soft lowercase mb-1.5 tracking-[0.005em]">
          {t("nav.streetLabel")}
        </span>
        <div className="text-[clamp(20px,2.2vw,28px)] font-light leading-[1.05] tracking-[-0.02em] text-ws-ink">
          {street},{" "}
          <span className="font-semibold text-ws-cream">{building}</span>
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
            {scheduleLines.map((line, index) => (
              <span key={index} className="block">
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
                onClick={() => copy(phone)}
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
                href={`tel:${phone}`}
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
            href={`tel:${phone}`}
            className="flex items-center justify-center gap-2 h-[46px] rounded-ws-sm font-semibold text-ws-base no-underline active:scale-[.98] transition-transform ws-btn-primary"
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
                href={getMessengerHref(m.key, phone)}
                icon={<Icon />}
                label={t(`messenger.${m.key}`)}
                colorClass={cn(m.colorClass, m.hoverClass)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

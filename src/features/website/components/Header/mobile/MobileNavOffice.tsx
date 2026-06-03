import { useTranslation } from "react-i18next";

import { type Location } from "@/entities/location/types";
import { PhoneIcon } from "@/features/website/components/icons/PhoneIcon";
import { PinIcon } from "@/features/website/components/icons/PinIcon";
import { MessengerLabelButton } from "@/features/website/components/MessengerLabelButton";
import { MESSENGER_ICONS } from "@/features/website/config";
import { MESSENGERS } from "@/features/website/config";
import {
  formatPhone,
  getMapsUrl,
  getMessengerHref,
} from "@/features/website/lib/service";
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard";
import { useLocalize } from "@/shared/hooks/useLocalize";
import { cn } from "@/shared/lib/utils";

interface MobileNavOfficeProps {
  location: Location;
  onClose: () => void;
}

export const MobileNavOffice = ({
  location,
  onClose,
}: MobileNavOfficeProps) => {
  const { t } = useTranslation("website");
  const localize = useLocalize();
  const { copied, copy } = useCopyToClipboard();

  const street = localize(location.streetRu, location.streetUa);
  const district = localize(location.districtRu, location.districtUa);
  const address = localize(location.addressRu, location.addressUa);

  return (
    <div className="flex flex-col gap-2 border-b border-ws-line-soft py-[14px] first:pt-[6px] last:border-b-0 last:pb-0">
      <a
        href={getMapsUrl(address)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-2.5 no-underline"
      >
        <PinIcon className="mt-[3px] size-3.5 shrink-0 text-ws-ember-bright" />
        <div>
          <span className="mb-[3px] block text-ws-sm font-semibold leading-[1.2] tracking-[-0.005em] text-ws-ink">
            {street}, {location.building}
          </span>
          <span className="block text-[9.5px] font-semibold uppercase tracking-[0.14em] text-ws-ink-mute">
            {district} мкр-н
          </span>
        </div>
      </a>

      <div className="flex items-stretch gap-1.5">
        <a
          href={`tel:${location.phone}`}
          className="flex flex-1 items-center gap-2.5 rounded-ws-sm border border-ws-line bg-white/[0.025] px-3 py-[10px] text-[15px] font-bold tabular-nums tracking-[-0.005em] text-ws-ink no-underline"
        >
          <PhoneIcon className="size-3.5 shrink-0 text-ws-ember-bright" />
          {formatPhone(location.phone)}
        </a>
        <button
          type="button"
          aria-label={t("nav.copyPhone")}
          onClick={() => copy(location.phone)}
          className={cn(
            "flex w-[42px] shrink-0 items-center justify-center rounded-ws-sm border border-ws-line bg-white/[0.025] transition-all duration-150 active:scale-[.94]",
            copied
              ? "border-ws-ember text-ws-ember-bright"
              : "text-ws-ink-soft",
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-3.5"
          >
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
        </button>
      </div>

      <div className="flex gap-1.5">
        {MESSENGERS.map((m) => {
          const Icon = MESSENGER_ICONS[m.key];
          const href = getMessengerHref(m.key, location.phone);
          return (
            <MessengerLabelButton
              key={m.key}
              href={href}
              icon={<Icon />}
              label={t(`messenger.${m.key}`)}
              colorClass={m.colorClass}
              onClick={onClose}
            />
          );
        })}
      </div>
    </div>
  );
};

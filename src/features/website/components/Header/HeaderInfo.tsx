import { useTranslation } from "react-i18next";

import { MESSENGER_ICONS } from "@/features/website/components/Header/HeaderData";
import { PhoneIcon } from "@/features/website/components/icons/PhoneIcon";
import { PinIcon } from "@/features/website/components/icons/PinIcon";
import { CONTACTS, MESSENGERS } from "@/features/website/config";
import { cn } from "@/shared/lib/utils";

export const HeaderInfo = () => {
  const { t } = useTranslation("website");

  return (
    <div className="hidden border-b border-ws-line-soft py-[22px] md:grid md:grid-cols-1 md:gap-[18px] xl:grid-cols-[minmax(0,1fr)_auto_auto] xl:items-center xl:gap-x-9">
      <div className="grid grid-cols-2 gap-x-8 gap-y-[14px]">
        {CONTACTS.map((c) => (
          <a
            key={c.phone}
            href={c.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-w-0 items-start gap-[11px] text-ws-ink no-underline transition-colors duration-200"
          >
            <PinIcon className="mt-[3px] size-4 shrink-0 text-ws-ember-bright" />
            <div className="min-w-0">
              <div className="text-ws-lg font-semibold leading-[1.25] tracking-[-0.005em] text-ws-ink transition-colors duration-200 group-hover:text-ws-ember-bright">
                {c.address}
              </div>
              <div className="mt-1 text-ws-sm font-semibold uppercase tracking-[0.16em] text-ws-ink-mute">
                {t(c.areaKey)}
              </div>
            </div>
          </a>
        ))}
      </div>

      <div
        className={cn(
          "flex flex-row flex-wrap gap-x-[22px] gap-y-[10px]",
          "border-t border-ws-line-soft pt-4",
          "xl:flex-col xl:flex-nowrap xl:gap-[10px] xl:border-l xl:border-ws-line xl:border-t-0 xl:pl-9 xl:pt-0",
        )}
      >
        {CONTACTS.map((c) => (
          <a
            key={c.phone}
            href={`tel:${c.phone}`}
            className="flex items-center gap-[10px] text-ws-lg font-semibold leading-[1.1] tracking-[-0.005em] text-ws-ink no-underline tabular-nums transition-colors duration-200 hover:text-ws-ember-bright"
          >
            <PhoneIcon className="size-[15px] shrink-0 text-ws-ember-bright" />
            {c.phoneFormatted}
          </a>
        ))}
      </div>

      <div className="flex gap-[6px] border-t border-ws-line-soft pt-4 xl:border-l xl:border-ws-line xl:border-t-0 xl:pl-9 xl:pt-0">
        {MESSENGERS.map((m) => {
          const Icon = MESSENGER_ICONS[m.key];
          return (
            <a
              key={m.key}
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t(`messenger.${m.key}`)}
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-[11px] border border-ws-line bg-white/[0.015] text-ws-ink-soft transition-all duration-200 hover:-translate-y-px [&>svg]:size-4",
                m.hoverClass,
              )}
            >
              <Icon />
            </a>
          );
        })}
      </div>
    </div>
  );
};

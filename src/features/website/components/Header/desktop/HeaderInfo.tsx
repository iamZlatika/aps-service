import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import { PhoneIcon } from "@/features/website/components/icons/PhoneIcon";
import { PinIcon } from "@/features/website/components/icons/PinIcon";
import { MESSENGER_ICONS } from "@/features/website/config";
import { MESSENGERS } from "@/features/website/config";
import { useLocations } from "@/features/website/hooks/useLocations";
import {
  formatPhone,
  getMapsUrl,
  getMessengerHref,
} from "@/features/website/lib/service";
import { useLocalize } from "@/shared/hooks/useLocalize";
import { cn } from "@/shared/lib/utils";

export const HeaderInfo = () => {
  const { t } = useTranslation("website");
  const { locations } = useLocations();
  const localize = useLocalize();

  return (
    <div className="hidden border-b border-ws-line-soft py-[14px] pb-4 md:flex md:flex-row md:flex-wrap md:items-stretch md:gap-8">
      {locations.map((location, index) => {
        const street = localize(location.streetRu, location.streetUa);
        const district = localize(location.districtRu, location.districtUa);
        const address = localize(location.addressRu, location.addressUa);
        return (
          <Fragment key={location.id}>
            {index > 0 && (
              <div
                className="hidden w-px self-stretch bg-ws-line md:mx-1 md:block"
                aria-hidden="true"
              />
            )}
            <address className="flex flex-wrap items-center gap-x-[22px] gap-y-3 not-italic md:flex-1 md:min-w-0">
              <a
                href={getMapsUrl(address)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-w-0 flex-1 basis-full items-start gap-[11px] text-ws-ink no-underline transition-colors duration-200 md:basis-auto"
              >
                <PinIcon className="mt-[3px] size-4 shrink-0 text-ws-ember-bright" />
                <div className="min-w-0">
                  <div className="text-ws-base font-semibold leading-[1.25] tracking-[-0.005em] text-ws-ink transition-colors duration-200 group-hover:text-ws-ember-bright">
                    {t("address.streetPrefix")} {street}, {location.building}
                  </div>
                  <div className="mt-1 text-ws-sm font-semibold uppercase tracking-[0.16em] text-ws-ink-mute">
                    {district} мкр-н
                  </div>
                </div>
              </a>

              <a
                href={`tel:${location.phone}`}
                className="flex items-center gap-[10px] text-ws-base font-semibold leading-[1.1] tracking-[-0.005em] text-ws-ink no-underline tabular-nums transition-colors duration-200 hover:text-ws-ember-bright"
              >
                <PhoneIcon className="size-[15px] shrink-0 text-ws-ember-bright" />
                <span>{formatPhone(location.phone)}</span>
              </a>

              <div className="flex gap-2">
                {MESSENGERS.map((m) => {
                  const Icon = MESSENGER_ICONS[m.key];
                  const href = getMessengerHref(m.key, location.phone);
                  return (
                    <a
                      key={m.key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(`messenger.${m.key}`)}
                      className={cn(
                        "inline-flex size-[38px] items-center justify-center rounded-ws-sm border border-ws-line bg-white/[0.015] text-ws-ink-soft transition-all duration-200 hover:-translate-y-px [&>svg]:size-[17px]",
                        m.hoverClass,
                      )}
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </address>
          </Fragment>
        );
      })}
    </div>
  );
};

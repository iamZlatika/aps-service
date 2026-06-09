import { Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { FooterSocialIcon } from "@/features/website/components/Footer/FooterSocialIcon";
import { WebsiteLogo } from "@/features/website/components/WebsiteLogo";
import { MESSENGER_ICONS, MESSENGERS } from "@/features/website/config";
import { useLocations } from "@/features/website/hooks/useLocations";
import {
  DEVICE_PARAM,
  MODAL_PARAM,
  PC_BUILD_MODAL_VALUE,
} from "@/features/website/lib/modalParams";
import {
  formatPhone,
  getMapsUrl,
  getMessengerHref,
} from "@/features/website/lib/service";
import { WEBSITE_LINKS } from "@/features/website/navigation";
import { DEVICES } from "@/features/website/pages/home/components/devices/DevicesData";
import { useLocalize } from "@/shared/hooks/useLocalize";
import { cn } from "@/shared/lib/utils";

const FOOTER_SERVICE_IDS = DEVICES.filter((d) => d.id !== "other").map(
  (d) => d.id,
);

const COMPANY_LINKS = [
  { labelKey: "footer.company.about", href: WEBSITE_LINKS.about },
  { labelKey: "footer.company.warranty", href: WEBSITE_LINKS.warranty },
  { labelKey: "footer.company.pricelist", href: WEBSITE_LINKS.priceList },
  { labelKey: "footer.company.reviews", href: WEBSITE_LINKS.reviews },
] as const;

const linkClass =
  "mb-[10px] block text-ws-base text-ws-ink-soft no-underline transition-colors duration-200 hover:text-ws-ember-bright";

const colHeadClass =
  "mb-[18px] text-ws-xs font-semibold uppercase tracking-[0.16em] text-ws-ink-mute";

export const Footer = () => {
  const { t } = useTranslation("website");
  const { locations } = useLocations();
  const localize = useLocalize();
  const messengerPhone = locations[0]?.phone;

  return (
    <footer className="border-t border-ws-line-soft">
      <div className="ws-wrap">
        {/* Mobile: copyright + privacy only */}
        <div className="pb-7 pt-10 text-center text-[11px] tracking-[0.04em] text-ws-ink-mute md:hidden">
          <p className="mb-[10px]">{t("footer.copyright")}</p>
          <p>{t("footer.privacy")}</p>
        </div>

        {/* Desktop: full layout */}
        <div className="hidden md:block">
          <div className="pt-[60px] pb-[30px]">
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-[50px]">
              <div>
                <WebsiteLogo className="mb-[14px] text-ws-ink" />
                <p className="max-w-[300px] text-ws-base leading-[1.55] text-ws-ink-soft">
                  {t("footer.description")}
                </p>
              </div>

              <div>
                <h3 className={colHeadClass}>{t("footer.services.title")}</h3>
                <ul>
                  {FOOTER_SERVICE_IDS.map((id) => (
                    <li key={id}>
                      <Link
                        to={`/?${DEVICE_PARAM}=${id}`}
                        className={linkClass}
                      >
                        {t(`devices.items.${id}.name`)}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      to={`/?${MODAL_PARAM}=${PC_BUILD_MODAL_VALUE}`}
                      className={linkClass}
                    >
                      {t("pcBuild.title")} {t("pcBuild.titleBold")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className={colHeadClass}>{t("footer.company.title")}</h3>
                <ul>
                  {COMPANY_LINKS.map(({ labelKey, href }) => (
                    <li key={labelKey}>
                      <Link to={href} className={linkClass}>
                        {t(labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className={colHeadClass}>{t("footer.contacts.title")}</h3>
                {locations.length === 0 ? (
                  <p className={linkClass}>
                    {t("footer.contacts.unavailable")}
                  </p>
                ) : (
                  <address className="not-italic">
                    {locations.map((location, index) => {
                      const street = localize(
                        location.streetRu,
                        location.streetUa,
                      );
                      const address = localize(
                        location.addressRu,
                        location.addressUa,
                      );
                      return (
                        <div
                          key={location.id}
                          className={cn(index > 0 && "mt-8")}
                        >
                          <a
                            href={`tel:${location.phone}`}
                            className={cn(
                              linkClass,
                              "flex items-center gap-2 mb-[4px]",
                            )}
                          >
                            <Phone className="size-[13px] shrink-0 text-ws-ember-bright" />
                            {formatPhone(location.phone)}
                          </a>
                          <a
                            href={getMapsUrl(address)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkClass}
                          >
                            {t("address.streetPrefix")} {street},{" "}
                            {location.building}
                          </a>
                        </div>
                      );
                    })}
                  </address>
                )}
              </div>
            </div>

            <div className="mt-[60px] flex flex-wrap items-center justify-between gap-4 border-t border-ws-line-soft pt-6 text-ws-xs text-ws-ink-mute">
              <span>{t("footer.copyright")}</span>
              {messengerPhone && (
                <div className="flex gap-2">
                  {MESSENGERS.map((m) => {
                    const Icon = MESSENGER_ICONS[m.key];
                    return (
                      <FooterSocialIcon
                        key={m.key}
                        href={getMessengerHref(m.key, messengerPhone)}
                        label={t(`messenger.${m.key}`)}
                        icon={<Icon />}
                      />
                    );
                  })}
                </div>
              )}
              <span>{t("footer.privacy")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

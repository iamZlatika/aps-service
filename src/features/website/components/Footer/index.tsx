import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import { FooterSocialIcon } from "@/features/website/components/Footer/FooterSocialIcon";
import { MESSENGER_ICONS } from "@/features/website/components/Header/HeaderData";
import { WebsiteLogo } from "@/features/website/components/WebsiteLogo";
import { MESSENGERS } from "@/features/website/config";
import { useLocations } from "@/features/website/hooks/useLocations";
import {
  formatPhone,
  getMapsUrl,
  getMessengerHref,
} from "@/features/website/lib/service";
import { WEBSITE_LINKS } from "@/features/website/navigation";
import { useLocalize } from "@/shared/hooks/useLocalize";

const SERVICE_LINKS = [
  { labelKey: "footer.services.pc", href: "#" },
  { labelKey: "footer.services.laptop", href: "#" },
  { labelKey: "footer.services.tv", href: "#" },
  { labelKey: "footer.services.phone", href: "#" },
  { labelKey: "footer.services.build", href: "#" },
] as const;

const COMPANY_LINKS = [
  { labelKey: "footer.company.about", href: "#" },
  { labelKey: "footer.company.warranty", href: "#" },
  { labelKey: "footer.company.pricelist", href: "#" },
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
                  {SERVICE_LINKS.map(({ labelKey, href }) => (
                    <li key={labelKey}>
                      <a href={href} className={linkClass}>
                        {t(labelKey)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className={colHeadClass}>{t("footer.company.title")}</h3>
                <ul>
                  {COMPANY_LINKS.map(({ labelKey, href }) => (
                    <li key={labelKey}>
                      <a href={href} className={linkClass}>
                        {t(labelKey)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className={colHeadClass}>{t("footer.contacts.title")}</h3>
                <address className="not-italic">
                  {locations.map((location) => {
                    const street = localize(
                      location.streetRu,
                      location.streetUa,
                    );
                    const address = localize(
                      location.addressRu,
                      location.addressUa,
                    );
                    return (
                      <Fragment key={location.id}>
                        <a href={`tel:${location.phone}`} className={linkClass}>
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
                      </Fragment>
                    );
                  })}
                </address>
              </div>
            </div>

            <div className="mt-[60px] flex flex-wrap items-center justify-between gap-4 border-t border-ws-line-soft pt-6 text-ws-xs text-ws-ink-mute">
              <span>{t("footer.copyright")}</span>
              <div className="flex gap-2">
                {MESSENGERS.map((m) => {
                  const Icon = MESSENGER_ICONS[m.key];
                  const phone = locations[0]?.phone ?? "";
                  return (
                    <FooterSocialIcon
                      key={m.key}
                      href={getMessengerHref(m.key, phone)}
                      label={t(`messenger.${m.key}`)}
                      icon={<Icon />}
                    />
                  );
                })}
              </div>
              <span>{t("footer.privacy")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

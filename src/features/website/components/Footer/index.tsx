import { useTranslation } from "react-i18next";

import { FooterSocialIcon } from "@/features/website/components/Footer/FooterSocialIcon";
import { MESSENGER_ICONS } from "@/features/website/components/Header/HeaderData";
import { WebsiteLogo } from "@/features/website/components/Header/WebsiteLogo";
import { CONTACTS, MESSENGERS } from "@/features/website/config";
import { WEBSITE_LINKS } from "@/features/website/navigation";

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
  "mb-[18px] text-[12px] font-semibold uppercase tracking-[0.16em] text-ws-ink-mute";

export const Footer = () => {
  const { t } = useTranslation("website");

  return (
    <footer className="ws-wrap">
      <div className="pt-[60px] pb-[30px]">
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-[50px]">
          <div>
            <WebsiteLogo className="mb-[14px] text-ws-ink" />
            <p className="max-w-[300px] text-ws-base leading-[1.55] text-ws-ink-soft">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h5 className={colHeadClass}>{t("footer.services.title")}</h5>
            {SERVICE_LINKS.map(({ labelKey, href }) => (
              <a key={labelKey} href={href} className={linkClass}>
                {t(labelKey)}
              </a>
            ))}
          </div>

          <div>
            <h5 className={colHeadClass}>{t("footer.company.title")}</h5>
            {COMPANY_LINKS.map(({ labelKey, href }) => (
              <a key={labelKey} href={href} className={linkClass}>
                {t(labelKey)}
              </a>
            ))}
          </div>

          <div>
            <h5 className={colHeadClass}>{t("footer.contacts.title")}</h5>
            {CONTACTS.map((c) => (
              <a key={c.phone} href={`tel:${c.phone}`} className={linkClass}>
                {c.phoneFormatted}
              </a>
            ))}
            {CONTACTS.map((c) => (
              <a
                key={c.address}
                href={c.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {c.address}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-[60px] flex flex-wrap items-center justify-between gap-4 border-t border-ws-line-soft pt-6 text-[12px] text-ws-ink-mute">
          <span>{t("footer.copyright")}</span>
          <div className="flex gap-2">
            {MESSENGERS.map((m) => {
              const Icon = MESSENGER_ICONS[m.key];
              return (
                <FooterSocialIcon
                  key={m.key}
                  href={m.href}
                  label={t(`messenger.${m.key}`)}
                  icon={<Icon />}
                />
              );
            })}
          </div>
          <span>{t("footer.privacy")}</span>
        </div>
      </div>
    </footer>
  );
};

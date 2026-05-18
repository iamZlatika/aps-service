import { Phone } from "lucide-react";
import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";

import { HamburgerButton } from "@/features/website/components/Header/HamburgerButton";
import { NAV_TABS } from "@/features/website/components/Header/HeaderData";
import { LangSwitch } from "@/features/website/components/Header/LangSwitch";
import { MessengerButton } from "@/features/website/components/Header/MessengerButton";
import { MobileNav } from "@/features/website/components/Header/MobileNav";
import { NavContacts } from "@/features/website/components/Header/NavContacts";
import { ThemeSwitch } from "@/features/website/components/Header/ThemeSwitch";
import { TelegramIcon } from "@/features/website/components/icons/TelegramIcon";
import { ViberIcon } from "@/features/website/components/icons/ViberIcon";
import { WhatsappIcon } from "@/features/website/components/icons/WhatsappIcon";
import {
  CONTACTS,
  type MessengerKey,
  MESSENGERS,
} from "@/features/website/config";
import { useMobileNav } from "@/features/website/hooks/useMobileNav";
import { WEBSITE_ROUTES } from "@/features/website/routes";
import { cn } from "@/shared/lib/utils";

const MESSENGER_ICONS: Record<MessengerKey, ReactNode> = {
  telegram: <TelegramIcon />,
  viber: <ViberIcon />,
  whatsapp: <WhatsappIcon />,
};

export const Header = () => {
  const { t } = useTranslation("website");
  const { isOpen, open, close } = useMobileNav();

  return (
    <>
      <header className="ws-wrap">
        {/* Desktop nav */}
        <nav className="hidden items-center justify-between gap-6 border-b border-[var(--ws-line-soft)] py-[22px] md:flex">
          <div className="flex items-center gap-7">
            <Link
              to={WEBSITE_ROUTES.home}
              aria-label="APS service"
              className="flex items-center gap-3 text-[var(--ws-ink)] no-underline"
            >
              <img
                src="/default.png"
                alt="APS service logo"
                className="block h-7 w-auto shrink-0"
              />
              <span className="text-[17px] font-bold leading-none tracking-[-0.01em]">
                APS
                <span className="font-medium text-[var(--ws-ink-mute)]">
                  .service
                </span>
                <small className="mt-1 block text-[11px] font-medium tracking-[0.02em] text-[var(--ws-ink-mute)]">
                  {t("nav.logoSubtitle")}
                </small>
              </span>
            </Link>

            <div className="flex items-center gap-[2px] rounded-full border border-[var(--ws-line)] bg-white/[0.015] p-[5px]">
              {NAV_TABS.map(({ labelKey, to, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      "whitespace-nowrap rounded-full px-[18px] py-[9px] text-[14px] font-medium no-underline transition-colors duration-200",
                      isActive
                        ? "bg-[var(--ws-cream)] font-semibold text-[var(--ws-bg)]"
                        : "text-[var(--ws-ink-soft)] hover:text-[var(--ws-ink)]",
                    )
                  }
                >
                  {t(labelKey)}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-[18px]">
            <NavContacts contacts={CONTACTS} />

            <div className="flex gap-[6px]">
              {MESSENGERS.map((m) => (
                <MessengerButton
                  key={m.key}
                  href={m.href}
                  label={t(`messenger.${m.key}`)}
                  icon={MESSENGER_ICONS[m.key]}
                  hoverClass={m.hoverClass}
                />
              ))}
            </div>

            <LangSwitch />
            <ThemeSwitch />
          </div>
        </nav>

        {/* Mobile bar */}
        <div className="flex items-center justify-between border-b border-[var(--ws-line-soft)] py-[18px] md:hidden">
          <Link
            to={WEBSITE_ROUTES.home}
            aria-label="APS service"
            className="flex items-center gap-3 text-[var(--ws-ink-hi)] no-underline"
          >
            <img
              src="/default.png"
              alt="APS service logo"
              className="block h-7 w-auto shrink-0"
            />
            <span className="text-[17px] font-bold leading-none tracking-[-0.01em]">
              APS
              <span className="font-medium text-[var(--ws-ink-mute)]">
                .service
              </span>
              <small className="mt-1 block text-[11px] font-medium tracking-[0.02em] text-[var(--ws-ink-mute)]">
                {t("nav.logoSubtitle")}
              </small>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${CONTACTS[0].phone}`}
              aria-label={CONTACTS[0].phoneFormatted}
              className="inline-flex size-[34px] items-center justify-center rounded-[9px] border border-[var(--ws-line)] bg-white/[0.015] text-[var(--ws-ink-hi)] transition-all duration-200 hover:-translate-y-px hover:border-transparent hover:bg-[#25d366] hover:text-white"
            >
              <Phone className="size-4" />
            </a>
            <HamburgerButton isOpen={isOpen} onClick={isOpen ? close : open} />
          </div>
        </div>
      </header>

      <MobileNav isOpen={isOpen} close={close} />
    </>
  );
};

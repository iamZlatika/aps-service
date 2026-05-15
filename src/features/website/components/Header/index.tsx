import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";

import { LangSwitch } from "@/features/website/components/Header/LangSwitch";
import { MessengerButton } from "@/features/website/components/Header/MessengerButton";
import { NavContacts } from "@/features/website/components/Header/NavContacts";
import { TelegramIcon } from "@/features/website/components/icons/TelegramIcon";
import { ViberIcon } from "@/features/website/components/icons/ViberIcon";
import { WhatsappIcon } from "@/features/website/components/icons/WhatsappIcon";
import {
  CONTACTS,
  type MessengerKey,
  MESSENGERS,
} from "@/features/website/config";
import { WEBSITE_ROUTES } from "@/features/website/routes";
import { cn } from "@/shared/lib/utils";

const MESSENGER_ICONS: Record<MessengerKey, ReactNode> = {
  telegram: <TelegramIcon />,
  viber: <ViberIcon />,
  whatsapp: <WhatsappIcon />,
};

const NAV_TABS = [
  { labelKey: "nav.home", to: WEBSITE_ROUTES.home, end: true },
  { labelKey: "nav.contacts", to: WEBSITE_ROUTES.contacts, end: false },
  { labelKey: "nav.works", to: WEBSITE_ROUTES.works, end: false },
] as const;

export const Header = () => {
  const { t } = useTranslation("website");

  return (
    <header className="ws-wrap">
      <nav className="flex flex-wrap items-center justify-between gap-6 border-b border-[var(--ws-line-soft)] py-[22px]">
        <div className="flex items-center gap-7">
          <Link
            to={WEBSITE_ROUTES.home}
            aria-label="APS service"
            className="flex items-center gap-3 text-[var(--ws-ink)] no-underline"
          >
            <img
              src="/default.jpg"
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

          <div className="flex items-center gap-[2px] rounded-full border border-[var(--ws-line)] bg-white/[0.015] p-[5px] max-sm:order-3 max-sm:w-full max-sm:justify-around">
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

        <div className="flex items-center gap-[18px] max-sm:gap-[10px]">
          <NavContacts contacts={CONTACTS} />

          <div className="flex gap-[6px] max-sm:gap-1">
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
        </div>
      </nav>
    </header>
  );
};

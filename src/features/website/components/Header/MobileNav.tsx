import { MapPin, Phone } from "lucide-react";
import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import { NAV_TABS } from "@/features/website/components/Header/HeaderData";
import { LangSwitch } from "@/features/website/components/Header/LangSwitch";
import { ThemeSwitch } from "@/features/website/components/Header/ThemeSwitch";
import { TelegramIcon } from "@/features/website/components/icons/TelegramIcon";
import { ViberIcon } from "@/features/website/components/icons/ViberIcon";
import { WhatsappIcon } from "@/features/website/components/icons/WhatsappIcon";
import {
  CONTACTS,
  type MessengerKey,
  MESSENGERS,
} from "@/features/website/config";
import { cn } from "@/shared/lib/utils";

const MESSENGER_ICONS: Record<MessengerKey, ReactNode> = {
  telegram: <TelegramIcon />,
  viber: <ViberIcon />,
  whatsapp: <WhatsappIcon />,
};

const MESSENGER_COLORS: Record<MessengerKey, string> = {
  telegram: "#2aa3e3",
  viber: "#7b5cd4",
  whatsapp: "#25d366",
};

interface MobileNavProps {
  isOpen: boolean;
  close: () => void;
}

export const MobileNav = ({ isOpen, close }: MobileNavProps) => {
  const { t } = useTranslation("website");

  return (
    <>
      <div
        aria-hidden="true"
        onClick={close}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Навігація"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[310px] flex-col overflow-y-auto border-l border-[var(--ws-line)] bg-[var(--ws-bg-2)] transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--ws-line-soft)] px-5 py-[18px]">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ws-ink-mute)]">
            {t("nav.menu")}
          </span>
          <button
            type="button"
            aria-label="Закрити меню"
            onClick={close}
            className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-[var(--ws-line)] text-[var(--ws-ink-hi)] transition-colors duration-200 hover:opacity-70"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="size-[16px]"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col px-5">
          {NAV_TABS.map(({ labelKey, to, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={close}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between border-b border-[var(--ws-line-soft)] py-[14px] text-[17px] font-medium no-underline transition-colors duration-200",
                  isActive
                    ? "text-[var(--ws-ember-bright)]"
                    : "text-[var(--ws-ink-hi)] hover:text-[var(--ws-ember-bright)]",
                )
              }
            >
              {t(labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className="mt-[22px] px-5">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ws-ink-mute)]">
            {t("nav.contacts")}
          </p>
          {CONTACTS.map((c) => (
            <a
              key={c.phone}
              href={`tel:${c.phone}`}
              className="flex items-center gap-[10px] py-[10px] text-[14.5px] font-medium text-[var(--ws-ink-hi)] no-underline"
            >
              <Phone className="size-[14px] shrink-0 text-[var(--ws-ember-bright)]" />
              {c.phoneFormatted}
            </a>
          ))}
          {CONTACTS.map((c) => (
            <a
              key={c.address}
              href={c.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[10px] py-[10px] text-[13px] text-[var(--ws-ink-soft)] no-underline"
            >
              <MapPin className="size-[14px] shrink-0 text-[var(--ws-ember-bright)]" />
              {c.address}
            </a>
          ))}
        </div>

        <div className="flex gap-[5px] px-4 py-4">
          {MESSENGERS.map((m) => (
            <a
              key={m.key}
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t(`messenger.${m.key}`)}
              style={{ color: MESSENGER_COLORS[m.key] }}
              className="flex flex-1 items-center justify-center gap-[5px] rounded-[11px] border border-[var(--ws-line)] bg-white/[0.015] px-2 py-3 text-[12px] font-semibold no-underline [&>svg]:size-4"
            >
              {MESSENGER_ICONS[m.key]}
              {t(`messenger.${m.key}`)}
            </a>
          ))}
        </div>

        <div className="flex gap-2 px-3 pb-6">
          <LangSwitch stretch />
          <ThemeSwitch stretch />
        </div>
      </div>
    </>
  );
};

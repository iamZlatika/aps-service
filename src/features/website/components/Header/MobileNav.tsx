import { MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import {
  MESSENGER_ICONS,
  NAV_TABS,
} from "@/features/website/components/Header/HeaderData";
import { LangSwitch } from "@/features/website/components/Header/LangSwitch";
import { ThemeSwitch } from "@/features/website/components/Header/ThemeSwitch";
import { CONTACTS, MESSENGERS } from "@/features/website/config";
import { cn } from "@/shared/lib/utils";

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
        aria-label={t("nav.navigation")}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[310px] flex-col overflow-y-auto border-l border-ws-line bg-ws-bg-2 transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-ws-line-soft px-5 py-[18px]">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ws-ink-mute">
            {t("nav.menu")}
          </span>
          <button
            type="button"
            aria-label={t("nav.closeMenu")}
            onClick={close}
            className="inline-flex size-ws-ctrl items-center justify-center rounded-ws-ctrl border border-ws-line text-ws-ink-hi transition-colors duration-200 hover:opacity-70"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="size-4"
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
                  "flex items-center justify-between border-b border-ws-line-soft py-3.5 text-[17px] font-medium no-underline transition-colors duration-200",
                  isActive
                    ? "text-ws-ember-bright"
                    : "text-ws-ink-hi hover:text-ws-ember-bright",
                )
              }
            >
              {t(labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className="mt-[22px] px-5">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ws-ink-mute">
            {t("nav.contacts")}
          </p>
          {CONTACTS.map((c) => (
            <a
              key={c.phone}
              href={`tel:${c.phone}`}
              className="flex items-center gap-2.5 py-[10px] text-[14.5px] font-medium text-ws-ink-hi no-underline"
            >
              <Phone className="size-3.5 shrink-0 text-ws-ember-bright" />
              {c.phoneFormatted}
            </a>
          ))}
          {CONTACTS.map((c) => (
            <a
              key={c.address}
              href={c.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 py-[10px] text-[13px] text-ws-ink-soft no-underline"
            >
              <MapPin className="size-3.5 shrink-0 text-ws-ember-bright" />
              {c.address}
            </a>
          ))}
        </div>

        <div className="flex gap-[5px] px-4 py-4">
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
                  "flex flex-1 items-center justify-center gap-[5px] rounded-[11px] border border-ws-line bg-white/[0.015] px-2 py-3 text-[12px] font-semibold no-underline [&>svg]:size-4",
                  m.colorClass,
                )}
              >
                <Icon />
                {t(`messenger.${m.key}`)}
              </a>
            );
          })}
        </div>

        <div className="flex gap-2 px-3 pb-6">
          <LangSwitch stretch />
          <ThemeSwitch stretch />
        </div>
      </div>
    </>
  );
};

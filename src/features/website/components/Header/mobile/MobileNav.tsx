import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import { NAV_TABS } from "@/features/website/components/Header/HeaderData";
import { MobileNavOffice } from "@/features/website/components/Header/mobile/MobileNavOffice";
import { LangSwitch } from "@/features/website/components/LangSwitch";
import { ThemeSwitch } from "@/features/website/components/ThemeSwitch";
import { useLocations } from "@/features/website/hooks/useLocations";
import { cn } from "@/shared/lib/utils";

interface MobileNavProps {
  isOpen: boolean;
  close: () => void;
}

export const MobileNav = ({ isOpen, close }: MobileNavProps) => {
  const { t } = useTranslation("website");
  const { locations } = useLocations();

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
          <span className="text-ws-2xs font-semibold uppercase tracking-[0.18em] text-ws-ink-mute">
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

        <nav className="px-5">
          <ul>
            {NAV_TABS.map(({ labelKey, to, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={close}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between border-b border-ws-line-soft py-3.5 text-ws-lg font-medium no-underline transition-colors duration-200",
                      isActive
                        ? "text-ws-ember-bright"
                        : "text-ws-ink-hi hover:text-ws-ember-bright",
                    )
                  }
                >
                  {t(labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-[22px] px-5">
          <p className="mb-3 text-ws-2xs font-semibold uppercase tracking-[0.18em] text-ws-ink-mute">
            {t("nav.contacts")}
          </p>
          {locations.map((location) => (
            <MobileNavOffice key={location.id} location={location} onClose={close} />
          ))}
        </div>

        <div className="mt-auto flex gap-2 px-3 pb-6 pt-4">
          <LangSwitch stretch />
          <ThemeSwitch stretch />
        </div>
      </div>
    </>
  );
};

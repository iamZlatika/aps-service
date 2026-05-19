import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import {
  MESSENGER_ICONS,
  NAV_TABS,
} from "@/features/website/components/Header/HeaderData";
import { LangSwitch } from "@/features/website/components/Header/LangSwitch";
import { MessengerButton } from "@/features/website/components/Header/MessengerButton";
import { NavContacts } from "@/features/website/components/Header/NavContacts";
import { ThemeSwitch } from "@/features/website/components/Header/ThemeSwitch";
import { WebsiteLogo } from "@/features/website/components/Header/WebsiteLogo";
import { CONTACTS, MESSENGERS } from "@/features/website/config";
import { cn } from "@/shared/lib/utils";

export const DesktopNav = () => {
  const { t } = useTranslation("website");

  return (
    <nav className="hidden items-center justify-between gap-6 border-b border-ws-line-soft py-[22px] md:flex">
      <div className="flex items-center gap-7">
        <WebsiteLogo className="text-ws-ink" />

        <div className="flex items-center gap-[2px] rounded-full border border-ws-line bg-white/[0.015] p-[5px]">
          {NAV_TABS.map(({ labelKey, to, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "whitespace-nowrap rounded-full px-[18px] py-[9px] text-[14px] font-medium no-underline transition-colors duration-200",
                  isActive
                    ? "bg-ws-cream font-semibold text-ws-bg"
                    : "text-ws-ink-soft hover:text-ws-ink",
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
  );
};

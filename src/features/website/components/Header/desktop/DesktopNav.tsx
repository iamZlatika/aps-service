import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import { HeaderAuthArea } from "@/features/website/components/Header/HeaderAuthArea";
import { NAV_TABS } from "@/features/website/components/Header/HeaderData";
import { LangSwitch } from "@/features/website/components/LangSwitch";
import { ThemeSwitch } from "@/features/website/components/ThemeSwitch";
import { WebsiteLogo } from "@/features/website/components/WebsiteLogo";
import { cn } from "@/shared/lib/utils";

export const DesktopNav = () => {
  const { t } = useTranslation("website");

  return (
    <nav className="hidden items-center justify-between gap-2 border-b border-ws-line-soft py-[14px] md:flex">
      <div className="flex items-center gap-7">
        <WebsiteLogo className="text-ws-ink" />

        <ul className="flex h-[53px] items-center gap-[2px] rounded-full border border-ws-line bg-white/[0.015] px-[5px]">
          {NAV_TABS.map(({ labelKey, to, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "whitespace-nowrap rounded-full px-[18px] py-[10px] text-ws-base font-medium no-underline transition-colors duration-200",
                    isActive
                      ? "bg-ws-cream font-semibold text-ws-bg"
                      : "text-ws-ink-soft hover:text-ws-ink",
                  )
                }
              >
                {t(labelKey)}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-3">
        <LangSwitch />
        <ThemeSwitch />
        <HeaderAuthArea />
      </div>
    </nav>
  );
};

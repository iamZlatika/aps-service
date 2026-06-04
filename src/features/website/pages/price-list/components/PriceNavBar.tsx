import { type RefObject } from "react";
import { useTranslation } from "react-i18next";

import { useLocalize } from "@/shared/hooks/useLocalize";
import { cn } from "@/shared/lib/utils";

import { type PriceGroup } from "../service";
import { SIDEBAR_DEFAULT_ICON, SIDEBAR_ICONS } from "./PriceNavBarData";

interface PriceNavBarProps {
  groups: PriceGroup[];
  activeKey: string;
  onSelect: (key: string) => void;
  navRef: RefObject<HTMLElement | null>;
}

export const PriceNavBar = ({
  groups,
  activeKey,
  onSelect,
  navRef,
}: PriceNavBarProps) => {
  const { t } = useTranslation("website");
  const localize = useLocalize();

  return (
    <nav
      ref={navRef}
      aria-label={t("pricePage.categories")}
      className="sticky top-[var(--ws-header-height,0px)] z-30 mb-6 border-b border-ws-line-soft bg-[color-mix(in_oklab,var(--ws-bg)_92%,transparent)] py-3 backdrop-blur-[10px] lg:top-[calc(var(--ws-header-height,0px)+24px)] lg:z-10 lg:mb-0 lg:border-b-0 lg:bg-transparent lg:py-0 lg:[backdrop-filter:none]"
    >
      <p className="mb-3.5 hidden pl-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ws-ink-mute lg:block">
        {t("pricePage.categories")}
      </p>

      <ul className="flex list-none flex-wrap gap-2 p-0 lg:flex-col lg:gap-0.5">
        {groups.map((g) => {
          const isActive = activeKey === g.category.key;
          return (
            <li key={g.category.key}>
              <button
                type="button"
                onClick={() => onSelect(g.category.key)}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "inline-flex items-center gap-[10px] whitespace-nowrap transition-all",
                  "rounded-[10px] border px-[14px] py-[9px] text-[13.5px] leading-[1.3]",
                  "max-lg:w-auto max-lg:rounded-full max-lg:font-semibold lg:w-full",
                  isActive
                    ? "border-[color-mix(in_oklab,var(--ws-ember)_28%,transparent)] bg-[color-mix(in_oklab,var(--ws-ember)_10%,transparent)] text-ws-ink"
                    : "border-transparent text-ws-ink-soft hover:text-ws-ink lg:hover:bg-[rgba(255,255,255,0.025)] max-lg:border-ws-line",
                )}
              >
                <span
                  aria-hidden="true"
                  className="hidden size-[17px] flex-shrink-0 text-ws-ember-bright [&>svg]:size-full lg:block"
                >
                  {SIDEBAR_ICONS[g.category.key] ?? SIDEBAR_DEFAULT_ICON}
                </span>
                {localize(g.category.nameRu, g.category.nameUk)}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

import { type RefObject } from "react";
import { useTranslation } from "react-i18next";

import { useLocalize } from "@/shared/hooks/useLocalize";
import { cn } from "@/shared/lib/utils";

import { type PriceGroup } from "../service";

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
      className="sticky top-[var(--ws-header-height,0px)] z-30 mb-6 border-b border-ws-line-soft bg-[color-mix(in_oklab,var(--ws-bg)_92%,transparent)] py-3 backdrop-blur-[10px]"
    >
      <ul className="flex list-none flex-wrap gap-2 p-0">
        {groups.map((g) => (
          <li key={g.category.key} className="flex-shrink-0">
            <button
              type="button"
              onClick={() => onSelect(g.category.key)}
              aria-current={activeKey === g.category.key || undefined}
              className={cn(
                "inline-flex whitespace-nowrap rounded-full border px-[15px] py-[9px] text-[13.5px] font-semibold leading-[1.2] transition-all",
                activeKey === g.category.key
                  ? "border-[color-mix(in_oklab,var(--ws-ember)_32%,transparent)] bg-[color-mix(in_oklab,var(--ws-ember)_10%,transparent)] text-ws-ink"
                  : "border-ws-line text-ws-ink-soft hover:border-ws-ink-mute hover:text-ws-ink",
              )}
            >
              {localize(g.category.nameRu, g.category.nameUk)}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

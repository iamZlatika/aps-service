import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  WARRANTY_STORAGE_RATES,
  type WarrantySectionStyle,
} from "@/features/website/pages/warranty/WarrantyPageData";
import { cn } from "@/shared/lib/utils";

interface WarrantySectionProps {
  index: number;
  titleKey: string;
  introKey?: string;
  itemsKey: string;
  style: WarrantySectionStyle;
  ratesAfterIndex?: number;
  defaultOpen?: boolean;
}

export const WarrantySection = ({
  index,
  titleKey,
  introKey,
  itemsKey,
  style,
  ratesAfterIndex,
  defaultOpen = false,
}: WarrantySectionProps) => {
  const { t } = useTranslation("website");
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const bodyId = useId();

  const rawItems = t(itemsKey, { returnObjects: true });
  const items = Array.isArray(rawItems) ? (rawItems as string[]) : [];

  return (
    <div className="overflow-hidden rounded-2xl border border-ws-line bg-ws-card">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={bodyId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center gap-4 px-6 py-5 text-left max-[560px]:gap-3 max-[560px]:px-[18px] max-[560px]:py-4"
      >
        <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] border border-[color-mix(in_oklab,var(--ws-ember)_26%,transparent)] bg-[color-mix(in_oklab,var(--ws-ember)_12%,transparent)] text-ws-sm font-bold tabular-nums text-ws-ember-bright">
          {index + 1}
        </span>
        <span className="flex-1 text-[16px] font-semibold leading-[1.3] tracking-[-0.005em] text-ws-ink [text-wrap:balance] max-[560px]:text-[15px]">
          {t(titleKey)}
        </span>
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-ws-ink-mute transition-transform duration-300",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div
          id={bodyId}
          className="px-6 pb-[22px] pt-0.5 max-[560px]:px-[18px] max-[560px]:pb-[18px]"
        >
          {introKey && (
            <p className="mb-1.5 text-ws-sm leading-[1.6] text-ws-ink-soft">
              {t(introKey)}
            </p>
          )}
          <ol className="list-none">
            {items.map((item, i) => (
              <li
                key={item}
                className={cn(
                  "flex gap-3 border-t border-ws-line-soft py-[11px] text-ws-sm leading-[1.6] text-ws-ink-soft [text-wrap:pretty] first:border-t-0",
                )}
              >
                {style === "numbered" ? (
                  <span className="mt-0.5 flex size-[22px] shrink-0 items-center justify-center rounded-[7px] border border-ws-line-soft bg-white/[.04] text-[11px] font-bold tabular-nums text-ws-ink-mute">
                    {i + 1}
                  </span>
                ) : (
                  <span className="mt-[9px] size-[5px] shrink-0 rounded-full bg-ws-ember-bright" />
                )}
                <span>
                  {item}
                  {ratesAfterIndex === i && (
                    <span className="mt-2 flex flex-wrap gap-2">
                      {WARRANTY_STORAGE_RATES.map((rate) => (
                        <span
                          key={rate.id}
                          className="inline-flex items-center gap-[7px] rounded-[9px] border border-ws-line-soft bg-white/[.03] px-3 py-[6px] text-[12.5px] text-ws-ink"
                        >
                          {t(rate.labelKey)}
                          <b className="font-bold tabular-nums text-ws-ember-bright">
                            {t(rate.priceKey)}
                          </b>
                        </span>
                      ))}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

import { format, isValid, parseISO } from "date-fns";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { TrackStatusHistoryItem } from "@/features/website/types";
import { cn } from "@/shared/lib/utils";

const VISIBLE_COUNT = 3;

interface StatusHistoryAccordionProps {
  items: TrackStatusHistoryItem[];
}

function formatEventDate(iso: string): string {
  const date = parseISO(iso);
  if (!isValid(date)) return iso;
  return format(date, "dd.MM.yyyy · HH:mm");
}

export const StatusHistoryAccordion = ({
  items,
}: StatusHistoryAccordionProps) => {
  const { t, i18n } = useTranslation("website");
  const [isExpanded, setIsExpanded] = useState(false);

  const visible = isExpanded ? items : items.slice(0, VISIBLE_COUNT);
  const hiddenCount = items.length - VISIBLE_COUNT;
  const hasMore = items.length > VISIBLE_COUNT;

  return (
    <div className="overflow-hidden rounded-2xl border border-ws-line bg-white/[.015]">
      <div className="flex items-center justify-between gap-3.5 border-b border-ws-line-soft px-6 py-3.5">
        <h3 className="text-[11px] font-semibold uppercase tracking-[.16em] text-ws-ink-mute">
          {t("track.history.title")}
        </h3>
        <span className="text-[12px] tracking-[.04em] text-ws-ink-mute">
          <b className="font-semibold tabular-nums text-ws-ink">
            {items.length}
          </b>{" "}
          {t("track.history.events")}
        </span>
      </div>

      <ol className="relative px-6 pb-2 pt-[18px] max-sm:px-4">
        <div className="pointer-events-none absolute bottom-7 left-9 top-7 w-px bg-ws-line max-sm:left-[29px]" />

        {visible.map((item, i) => {
          const isCurrent = i === 0;
          const name =
            i18n.language === "ru" ? item.status.nameRu : item.status.nameUa;

          return (
            <li
              key={`${item.status.id}-${item.createdAt}`}
              className="relative pb-3.5 pl-[38px] pt-2"
            >
              <span
                className={cn(
                  "absolute left-[7px] top-3.5 z-10 box-border h-[11px] w-[11px] rounded-full border-2",
                  isCurrent
                    ? "border-ws-ember bg-ws-ember"
                    : "border-ws-ink-mute bg-ws-bg-2",
                )}
                style={
                  isCurrent
                    ? {
                        boxShadow:
                          "0 0 0 4px color-mix(in oklab, var(--ws-ember) 24%, transparent)",
                      }
                    : undefined
                }
              />
              <span className="block text-[11px] uppercase tracking-[.04em] text-ws-ink-mute tabular-nums">
                {formatEventDate(item.createdAt)}
              </span>
              <span
                className={cn(
                  "mt-1 block text-ws-md leading-[1.4]",
                  isCurrent
                    ? "font-semibold text-ws-ink"
                    : "font-medium text-ws-ink-soft",
                )}
              >
                {name}
              </span>
            </li>
          );
        })}
      </ol>

      {hasMore && (
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex w-full items-center justify-center gap-2.5 border-t border-ws-line-soft px-6 py-3.5 text-ws-sm font-semibold text-ws-ember-bright transition-colors hover:bg-white/[.025]"
        >
          <span>
            {isExpanded
              ? t("track.history.collapse")
              : t("track.history.showMore", { count: hiddenCount })}
          </span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-300",
              isExpanded && "rotate-180",
            )}
          />
        </button>
      )}
    </div>
  );
};

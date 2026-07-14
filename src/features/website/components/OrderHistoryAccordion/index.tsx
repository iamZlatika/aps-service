import { format, isValid, parseISO } from "date-fns";
import { Box, ChevronDown, Cog } from "lucide-react";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";

import { formatPrice } from "@/features/website/lib/service";
import type { OrderHistoryItem } from "@/features/website/types";
import { useLocalizedName } from "@/shared/hooks/useLocalizedName";
import { assertNever } from "@/shared/lib/assertNever";
import { cn } from "@/shared/lib/utils";

interface OrderHistoryAccordionProps {
  items: OrderHistoryItem[];
  titleKey?: string;
  visibleCount?: number;
}

function formatEventDate(iso: string): string {
  const date = parseISO(iso);
  if (!isValid(date)) return iso;
  return format(date, "dd.MM.yyyy · HH:mm");
}

interface ItemContentProps {
  item: OrderHistoryItem;
  isCurrent: boolean;
}

const ItemContent = ({ item, isCurrent }: ItemContentProps) => {
  const { t } = useTranslation("website");
  const getLocalizedName = useLocalizedName();

  if (item.type === "status") {
    const name = getLocalizedName(item.status);
    const isNew = item.status.key === "new";

    return (
      <div className="mt-1 flex flex-wrap items-center gap-2.5">
        <span
          className={cn(
            "inline-flex items-center gap-[7px] rounded-full border px-3 py-[5px] text-[12.5px] font-semibold leading-none tracking-[0.005em]",
            isCurrent
              ? "border-[color-mix(in_oklab,var(--ws-ember)_26%,transparent)] bg-[color-mix(in_oklab,var(--ws-ember)_12%,transparent)] text-ws-ember-bright"
              : "border-ws-line bg-white/[.03] text-ws-ink-soft",
          )}
        >
          <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-current" />
          {name}
        </span>
        {!isNew && (
          <span className="text-[12px] tracking-[.01em] text-ws-ink-mute">
            {t("track.history.statusChanged")}
          </span>
        )}
      </div>
    );
  }

  if (item.type === "payment") {
    const isRefund = item.paymentType === "refund";
    return (
      <div
        className={cn(
          "mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-ws-md font-medium leading-[1.4]",
          isRefund ? "text-rose-400" : "text-emerald-500",
        )}
      >
        <span>{formatPrice(item.amount)}</span>
        <span className="font-normal text-ws-ink-mute">
          {t(`track.history.payment.${item.paymentType}`)}
          {" · "}
          {t(`track.history.payment.method.${item.method}`)}
        </span>
      </div>
    );
  }

  if (item.type === "product" || item.type === "service") {
    const Icon = item.type === "product" ? Box : Cog;
    const isDeleted = item.event === "deleted";
    const labelKey =
      item.type === "product"
        ? "track.history.productAdded"
        : "track.history.serviceAdded";

    if (isDeleted) {
      return (
        <span className="mt-1 block text-ws-md text-ws-ink-mute line-through">
          {item.name}
        </span>
      );
    }

    return (
      <div className="mt-1">
        <span className="mb-2 block text-ws-md text-ws-ink-soft">
          {t(labelKey)}
        </span>
        <div className="flex max-w-[560px] flex-wrap items-center gap-3.5 rounded-xl border border-ws-line-soft px-4 py-3">
          <Icon className="h-[18px] w-[18px] shrink-0 text-ws-ember-bright" />
          <span className="min-w-[140px] flex-1 text-[14px] font-semibold leading-[1.3] tracking-[-0.005em] text-ws-ink">
            {item.name}
          </span>
          <div className="flex shrink-0 overflow-hidden rounded-[9px] border border-ws-line-soft">
            <div className="flex min-w-[58px] flex-col items-end gap-[3px] border-r border-ws-line-soft px-3 py-[7px]">
              <span className="text-[9px] font-semibold uppercase leading-none tracking-[.12em] text-ws-ink-mute">
                {t("track.history.qty")}
              </span>
              <span className="text-[13.5px] font-semibold tabular-nums leading-none text-ws-ink">
                ×{item.quantity}
              </span>
            </div>
            <div className="flex min-w-[58px] flex-col items-end gap-[3px] border-r border-ws-line-soft px-3 py-[7px]">
              <span className="text-[9px] font-semibold uppercase leading-none tracking-[.12em] text-ws-ink-mute">
                {t("track.history.priceLabel")}
              </span>
              <span className="text-[13.5px] font-semibold tabular-nums leading-none text-ws-ink">
                {formatPrice(item.price)}
              </span>
            </div>
            <div className="flex min-w-[58px] flex-col items-end gap-[3px] bg-white/[.03] px-3 py-[7px]">
              <span className="text-[9px] font-semibold uppercase leading-none tracking-[.12em] text-ws-ink-mute">
                {t("track.history.sumLabel")}
              </span>
              <span className="text-[13.5px] font-semibold tabular-nums leading-none text-ws-ember-bright">
                {formatPrice(item.sum)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return assertNever(item);
};

export const OrderHistoryAccordion = ({
  items,
  titleKey = "track.history.title",
  visibleCount = 4,
}: OrderHistoryAccordionProps) => {
  const { t } = useTranslation("website");
  const [isExpanded, setIsExpanded] = useState(false);
  const titleId = useId();
  const listId = useId();

  const visible = isExpanded ? items : items.slice(0, visibleCount);
  const hiddenCount = items.length - visibleCount;
  const hasMore = items.length > visibleCount;

  return (
    <div className="overflow-hidden rounded-2xl border border-ws-line bg-white/[.015]">
      <div className="flex items-center justify-between gap-3.5 border-b border-ws-line-soft px-6 py-3.5">
        <h3
          id={titleId}
          className="text-[11px] font-semibold uppercase tracking-[.16em] text-ws-ink-mute"
        >
          {t(titleKey)}
        </h3>
        <span className="text-[12px] tracking-[.04em] text-ws-ink-mute">
          <b className="font-semibold tabular-nums text-ws-ink">
            {items.length}
          </b>{" "}
          {t("track.history.events")}
        </span>
      </div>

      <ol
        id={listId}
        aria-labelledby={titleId}
        className="relative px-6 pb-2 pt-[18px] max-sm:px-4"
      >
        <div className="pointer-events-none absolute bottom-7 left-9 top-7 w-px bg-ws-line max-sm:left-[29px]" />

        {visible.map((item, i) => {
          const isCurrent = i === 0;
          return (
            <li key={item.id} className="relative pb-3.5 pl-[38px] pt-2">
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
                {formatEventDate(item.date)}
              </span>
              <ItemContent item={item} isCurrent={isCurrent} />
            </li>
          );
        })}
      </ol>

      {hasMore && (
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={listId}
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

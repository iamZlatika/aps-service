import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { getPageNumbers } from "@/shared/lib/pagination";
import { cn } from "@/shared/lib/utils";

interface OrdersPagerProps {
  page: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

const pageButtonClass =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-[11px] border px-3 text-sm font-semibold tabular-nums transition-all duration-150";

const idleButtonClass =
  "border-ws-line bg-ws-card text-ws-ink-soft hover:border-ws-ink-mute hover:text-ws-ink";

export const OrdersPager = ({
  page,
  lastPage,
  onPageChange,
}: OrdersPagerProps) => {
  const { t } = useTranslation("website");

  if (lastPage < 2) return null;

  const items = getPageNumbers(page, lastPage);

  return (
    <nav
      aria-label={t("cabinet.ordersPagerLabel")}
      className="mt-6 flex flex-wrap items-center justify-center gap-1.5"
    >
      <button
        type="button"
        aria-label={t("cabinet.ordersPagePrev")}
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className={cn(pageButtonClass, idleButtonClass, "disabled:opacity-35")}
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </button>

      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="min-w-7 select-none text-center font-semibold text-ws-ink-mute"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === page ? "page" : undefined}
            onClick={() => onPageChange(item)}
            className={cn(
              pageButtonClass,
              item === page
                ? "border-ws-cream bg-ws-cream text-ws-bg"
                : idleButtonClass,
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label={t("cabinet.ordersPageNext")}
        disabled={page === lastPage}
        onClick={() => onPageChange(page + 1)}
        className={cn(pageButtonClass, idleButtonClass, "disabled:opacity-35")}
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </button>
    </nav>
  );
};

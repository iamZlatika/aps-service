import { format, isBefore, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/components/ui/button.tsx";
import { Calendar } from "@/shared/components/ui/calendar.tsx";
import { cn } from "@/shared/lib/utils.ts";

interface DateRangeFilterProps {
  from: string;
  to: string;
  onApply: (from: string, to: string) => void;
}

const parseStoredDate = (value: string): Date =>
  parse(value, "yyyy-MM-dd", new Date());

const toRange = (from: string, to: string): DateRange | undefined =>
  from
    ? { from: parseStoredDate(from), to: to ? parseStoredDate(to) : undefined }
    : undefined;

export const DateRangeFilter = ({
  from,
  to,
  onApply,
}: DateRangeFilterProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingRange, setPendingRange] = useState<DateRange | undefined>(() =>
    toRange(from, to),
  );
  // Tracked ourselves rather than derived from pendingRange.from/to: react-day-picker's
  // own range algorithm treats a range as "complete" the moment from === to (which
  // happens after the very first click), and once complete it edits whichever end is
  // closer to the new click instead of always starting a fresh range. That makes it
  // impossible to move the start date later without clearing the filter first. This
  // flag instead reflects "the user has picked two distinct ends", so the next click
  // always starts a brand new range.
  const [isRangeComplete, setIsRangeComplete] = useState(!!(from && to));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const openPicker = () => {
    setPendingRange(toRange(from, to));
    setIsRangeComplete(!!(from && to));
    setIsOpen(true);
  };

  const handleSelect = (_range: DateRange | undefined, triggerDate: Date) => {
    if (!pendingRange?.from || isRangeComplete) {
      // no selection yet, or the previous range was already complete — this click
      // always starts a new range instead of adjusting the existing one.
      setPendingRange({ from: triggerDate, to: undefined });
      setIsRangeComplete(false);
      return;
    }

    setPendingRange(
      isBefore(triggerDate, pendingRange.from)
        ? { from: triggerDate, to: pendingRange.from }
        : { from: pendingRange.from, to: triggerDate },
    );
    setIsRangeComplete(true);
  };

  const handleApply = () => {
    onApply(
      pendingRange?.from ? format(pendingRange.from, "yyyy-MM-dd") : "",
      pendingRange?.to ? format(pendingRange.to, "yyyy-MM-dd") : "",
    );
    setIsOpen(false);
  };

  const handleCancel = () => {
    setPendingRange(toRange(from, to));
    setIsRangeComplete(!!(from && to));
    setIsOpen(false);
  };

  const label =
    from && to
      ? `${format(parseStoredDate(from), "dd.MM.yyyy")} — ${format(parseStoredDate(to), "dd.MM.yyyy")}`
      : t("common.date_range_filter.placeholder");

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? setIsOpen(false) : openPicker())}
        className={cn(
          "flex h-9 items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring",
          !from && "text-muted-foreground",
        )}
      >
        <CalendarIcon size={14} className="shrink-0 text-muted-foreground" />
        {label}
      </button>
      {isOpen && (
        <div className="absolute top-full z-50 mt-1 rounded-md border bg-popover shadow-md">
          <Calendar
            mode="range"
            selected={pendingRange}
            onSelect={handleSelect}
            defaultMonth={pendingRange?.from}
          />
          <div className="flex justify-end gap-2 border-t p-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCancel}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!pendingRange?.from || !pendingRange?.to}
              onClick={handleApply}
            >
              {t("common.date_range_filter.apply")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

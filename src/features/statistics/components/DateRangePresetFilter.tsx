import {
  endOfMonth,
  format,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns";
import { useTranslation } from "react-i18next";

import { DateRangeFilter } from "@/shared/components/common/DateRangeFilter.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { cn } from "@/shared/lib/utils.ts";

interface DateRangePresetFilterProps {
  from: string;
  to: string;
  onApply: (from: string, to: string) => void;
}

const fmt = (date: Date): string => format(date, "yyyy-MM-dd");

const presets = (today: Date): { key: string; range: [string, string] }[] => [
  { key: "today", range: [fmt(today), fmt(today)] },
  { key: "7d", range: [fmt(subDays(today, 6)), fmt(today)] },
  { key: "30d", range: [fmt(subDays(today, 29)), fmt(today)] },
  { key: "this_month", range: [fmt(startOfMonth(today)), fmt(today)] },
  {
    key: "last_month",
    range: [
      fmt(startOfMonth(subMonths(today, 1))),
      fmt(endOfMonth(subMonths(today, 1))),
    ],
  },
  { key: "this_year", range: [fmt(startOfYear(today)), fmt(today)] },
];

export const DateRangePresetFilter = ({
  from,
  to,
  onApply,
}: DateRangePresetFilterProps) => {
  const { t } = useTranslation();
  const today = new Date();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {presets(today).map(({ key, range: [presetFrom, presetTo] }) => (
        <Button
          key={key}
          type="button"
          size="sm"
          variant="outline"
          className={cn(
            from === presetFrom &&
              to === presetTo &&
              "bg-accent text-accent-foreground",
          )}
          onClick={() => onApply(presetFrom, presetTo)}
        >
          {t(`statistics.filters.presets.${key}`)}
        </Button>
      ))}
      <DateRangeFilter from={from} to={to} onApply={onApply} />
    </div>
  );
};

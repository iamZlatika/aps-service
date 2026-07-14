import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useFilterParams } from "@/features/backoffice/widgets/table/hooks/useFilterParams.ts";
import { cn } from "@/shared/lib/utils.ts";

export const CUSTOMERS_BOOLEAN_FILTER_KEYS = [
  "has_google",
  "has_password",
  "email_verified",
  "has_verified_phone",
  "telegram_subscribed",
] as const;

type CustomersBooleanFilterKey = (typeof CUSTOMERS_BOOLEAN_FILTER_KEYS)[number];

type FilterChipState = "unset" | "true" | "false";

const nextFilterValue = (current: string | undefined): string => {
  if (current === "1") return "0";
  if (current === "0") return "";
  return "1";
};

const getFilterChipState = (current: string | undefined): FilterChipState => {
  if (current === "1") return "true";
  if (current === "0") return "false";
  return "unset";
};

interface FilterChipProps {
  label: string;
  state: FilterChipState;
  onClick: () => void;
}

const FilterChip = ({ label, state, onClick }: FilterChipProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={state !== "unset"}
    className={cn(
      "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm whitespace-nowrap transition-colors focus:outline-none",
      state === "true" && "bg-primary text-primary-foreground border-primary",
      state === "false" &&
        "bg-destructive/10 text-destructive border-destructive",
      state === "unset" &&
        "bg-transparent text-muted-foreground border-input hover:text-foreground",
    )}
  >
    {state === "true" && <Check className="h-3.5 w-3.5" />}
    {state === "false" && <X className="h-3.5 w-3.5" />}
    {label}
  </button>
);

export const CustomersFilterBar = () => {
  const { t } = useTranslation();
  const { filters, setFilter } = useFilterParams();

  const toggleFilter = (key: CustomersBooleanFilterKey) => {
    setFilter(key, nextFilterValue(filters[key]));
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center gap-2 min-w-max">
        {CUSTOMERS_BOOLEAN_FILTER_KEYS.map((key) => (
          <FilterChip
            key={key}
            label={t(`customers.filters.${key}`)}
            state={getFilterChipState(filters[key])}
            onClick={() => toggleFilter(key)}
          />
        ))}
      </div>
    </div>
  );
};

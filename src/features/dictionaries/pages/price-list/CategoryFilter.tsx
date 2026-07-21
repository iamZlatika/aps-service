import { useTranslation } from "react-i18next";

import { cn } from "@/shared/lib/utils";
import { useFilterParams } from "@/widgets/table/hooks/useFilterParams";

import { PRICE_LIST_CATEGORIES } from "./categories";

interface FilterTabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const FilterTab = ({ label, active, onClick }: FilterTabProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "pb-2 text-sm whitespace-nowrap transition-colors focus:outline-none border-b-2 -mb-px",
      active
        ? "text-foreground font-medium border-primary"
        : "text-muted-foreground hover:text-foreground border-transparent",
    )}
  >
    {label}
  </button>
);

export const CategoryFilter = () => {
  const { i18n, t } = useTranslation();
  const { filters, setFilter } = useFilterParams();
  const active = filters["categories[]"] ?? "";

  const options = [
    { value: "", label: t("dictionaries.price_list.all_categories") },
    ...Object.entries(PRICE_LIST_CATEGORIES).map(([key, cat]) => ({
      value: key,
      label: i18n.language === "uk" ? cat.nameUk : cat.nameRu,
    })),
  ];

  return (
    <div className="overflow-x-auto">
      <div className="flex items-end gap-5 border-b min-w-max">
        {options.map((opt) => (
          <FilterTab
            key={opt.value}
            label={opt.label}
            active={active === opt.value}
            onClick={() => setFilter("categories[]", opt.value)}
          />
        ))}
      </div>
    </div>
  );
};

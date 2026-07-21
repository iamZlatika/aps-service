import { X } from "lucide-react";
import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface ClearFilterButtonProps {
  onClick: () => void;
}

const ClearFilterButton = ({ onClick }: ClearFilterButtonProps) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t("billing.filters.clear")}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      <X className="h-3.5 w-3.5" />
    </button>
  );
};

interface FilterSlotProps {
  active: boolean;
  onClear: () => void;
  children: ReactNode;
}

export const FilterSlot = ({ active, onClear, children }: FilterSlotProps) => (
  <div className="flex items-center gap-1">
    {children}
    {active && <ClearFilterButton onClick={onClear} />}
  </div>
);

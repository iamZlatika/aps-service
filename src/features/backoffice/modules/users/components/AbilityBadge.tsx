import { useTranslation } from "react-i18next";

import { Badge } from "@/shared/components/ui/badge.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip.tsx";
import { cn } from "@/shared/lib/utils.ts";

interface AbilityBadgeProps {
  label: string;
  colorClass: string;
  highlightClass: string;
  isActive: boolean;
  isCustom: boolean;
  isPending: boolean;
  fromRole: boolean;
  onToggle?: () => void;
}

export const AbilityBadge = ({
  label,
  colorClass,
  highlightClass,
  isActive,
  isCustom,
  isPending,
  fromRole,
  onToggle,
}: AbilityBadgeProps) => {
  const { t } = useTranslation();

  const badge = (
    <Badge
      onClick={onToggle}
      role={onToggle ? "button" : undefined}
      tabIndex={onToggle ? 0 : undefined}
      aria-pressed={onToggle ? isActive : undefined}
      onKeyDown={
        onToggle
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggle();
              }
            }
          : undefined
      }
      className={cn(
        "text-sm font-medium px-3 py-1 select-none transition-all",
        isPending
          ? "opacity-60 cursor-not-allowed"
          : fromRole
            ? "cursor-default"
            : "cursor-pointer",
        colorClass,
        highlightClass,
      )}
    >
      {label}
    </Badge>
  );

  if (!isCustom) return badge;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{badge}</TooltipTrigger>
      <TooltipContent>
        {t("users.roles_permissions.custom_tooltip")}
      </TooltipContent>
    </Tooltip>
  );
};

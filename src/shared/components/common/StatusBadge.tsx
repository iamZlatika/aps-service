import { ChevronDown, Loader2 } from "lucide-react";

import { statusColorMap, statusTextColorMap } from "@/shared/lib/constants.ts";
import { cn } from "@/shared/lib/utils.ts";

interface StatusBadgeProps {
  name: string;
  color: string;
  isPending?: boolean;
  selectable?: boolean;
}

export const StatusBadge = ({
  name,
  color,
  isPending,
  selectable,
}: StatusBadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-lg px-2 py-1.5 text-sm font-medium",
      statusColorMap[color as keyof typeof statusColorMap],
      statusTextColorMap[color as keyof typeof statusTextColorMap],
    )}
  >
    <span className="flex items-center gap-1">
      <span>{name}</span>
    </span>
    <span className="flex items-center gap-1 ml-1">
      {selectable && (
        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      )}
      {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
    </span>
  </span>
);

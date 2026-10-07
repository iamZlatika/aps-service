import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip.tsx";
import { formatDateTime } from "@/shared/lib/utils.ts";

interface BankTransactionDateCellProps {
  readonly occurredAt: string;
  readonly isLate: boolean;
}

export const BankTransactionDateCell = ({
  occurredAt,
  isLate,
}: BankTransactionDateCellProps) => {
  const { t } = useTranslation();

  return (
    <span className="flex items-center gap-1">
      {formatDateTime(occurredAt) ?? "—"}
      {isLate && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Clock
                className="h-4 w-4 text-muted-foreground"
                aria-label={t("banking.transactions.late_hint")}
              />
            </TooltipTrigger>
            <TooltipContent>
              {t("banking.transactions.late_hint")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </span>
  );
};

import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useFilterParams } from "@/features/backoffice/widgets/table/hooks/useFilterParams.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";
import { SMS_MESSAGE_STATUSES } from "@/shared/types.ts";

const ALL_VALUE = "__all__";

export const SmsMessagesFilterBar = () => {
  const { t } = useTranslation();
  const { filters, setFilter } = useFilterParams();

  return (
    <div className="flex items-center gap-1">
      <Select
        value={filters.status ?? ALL_VALUE}
        onValueChange={(val) =>
          setFilter("status", val === ALL_VALUE ? "" : val)
        }
      >
        <SelectTrigger className="h-9 text-sm w-48">
          <SelectValue
            placeholder={t("smsIntegration.messages.filters.status")}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>
            {t("smsIntegration.messages.filters.status")}
          </SelectItem>
          {Object.values(SMS_MESSAGE_STATUSES).map((status) => (
            <SelectItem key={status} value={status}>
              {t(`smsIntegration.messages.statuses.${status}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {filters.status && (
        <button
          type="button"
          onClick={() => setFilter("status", "")}
          aria-label={t("smsIntegration.messages.filters.clear")}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

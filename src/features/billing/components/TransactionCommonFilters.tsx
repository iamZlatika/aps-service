import { useTranslation } from "react-i18next";

import { FilterSlot } from "@/features/billing/components/FilterSlot.tsx";
import { TransactionDateRangeFilter } from "@/features/billing/components/TransactionDateRangeFilter.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";
import {
  TRANSACTION_STATUSES,
  TRANSACTION_TYPES,
  type TransactionType,
} from "@/shared/types.ts";
import { useFilterParams } from "@/widgets/table/hooks/useFilterParams.ts";

const ALL_VALUE = "__all__";

interface TransactionCommonFiltersProps {
  readonly excludedTypes?: TransactionType[];
  readonly showDateRange?: boolean;
}

export const TransactionCommonFilters = ({
  excludedTypes = [],
  showDateRange = true,
}: TransactionCommonFiltersProps) => {
  const { t } = useTranslation();
  const { filters, setFilter, setFilters } = useFilterParams();

  return (
    <>
      <FilterSlot active={!!filters.type} onClear={() => setFilter("type", "")}>
        <Select
          value={filters.type ?? ALL_VALUE}
          onValueChange={(val) =>
            setFilter("type", val === ALL_VALUE ? "" : val)
          }
        >
          <SelectTrigger className="h-9 text-sm w-56">
            <SelectValue placeholder={t("billing.filters.type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>
              {t("billing.filters.type")}
            </SelectItem>
            {Object.values(TRANSACTION_TYPES)
              .filter((type) => !excludedTypes.includes(type))
              .map((type) => (
                <SelectItem key={type} value={type}>
                  {t(`billing.transaction_types.${type}`)}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </FilterSlot>

      <FilterSlot
        active={!!filters.status}
        onClear={() => setFilter("status", "")}
      >
        <Select
          value={filters.status ?? ALL_VALUE}
          onValueChange={(val) =>
            setFilter("status", val === ALL_VALUE ? "" : val)
          }
        >
          <SelectTrigger className="h-9 text-sm w-40">
            <SelectValue placeholder={t("billing.filters.status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>
              {t("billing.filters.status")}
            </SelectItem>
            {Object.values(TRANSACTION_STATUSES).map((status) => (
              <SelectItem key={status} value={status}>
                {t(`billing.transaction_statuses.${status}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSlot>

      {showDateRange && (
        <FilterSlot
          active={!!filters["created_at[0]"]}
          onClear={() =>
            setFilters({ "created_at[0]": "", "created_at[1]": "" })
          }
        >
          <TransactionDateRangeFilter
            from={filters["created_at[0]"] ?? ""}
            to={filters["created_at[1]"] ?? ""}
            onApply={(from, to) =>
              setFilters({ "created_at[0]": from, "created_at[1]": to })
            }
          />
        </FilterSlot>
      )}

      <FilterSlot
        active={!!filters.order_number}
        onClear={() => setFilter("order_number", "")}
      >
        <Input
          value={filters.order_number ?? ""}
          onChange={(e) => setFilter("order_number", e.target.value)}
          placeholder={t("billing.filters.order_number")}
          className="h-9 text-sm w-32"
        />
      </FilterSlot>
    </>
  );
};

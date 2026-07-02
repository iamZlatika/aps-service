import { useTranslation } from "react-i18next";

import { EmployeeSelect } from "@/features/backoffice/modules/billing/components/EmployeeSelect.tsx";
import { FilterSlot } from "@/features/backoffice/modules/billing/components/FilterSlot.tsx";
import { TransactionDateRangeFilter } from "@/features/backoffice/modules/billing/components/TransactionDateRangeFilter.tsx";
import { useFilterParams } from "@/features/backoffice/widgets/table/hooks/useFilterParams.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";
import { TRANSACTION_STATUSES, TRANSACTION_TYPES } from "@/shared/types.ts";

const ALL_VALUE = "__all__";

export const AllTransactionsFilterBar = () => {
  const { t } = useTranslation();
  const { filters, setFilter, setFilters, resetFilters } = useFilterParams();

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
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
            {Object.values(TRANSACTION_TYPES).map((type) => (
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

      <FilterSlot
        active={!!filters["created_at[0]"]}
        onClear={() => setFilters({ "created_at[0]": "", "created_at[1]": "" })}
      >
        <TransactionDateRangeFilter
          from={filters["created_at[0]"] ?? ""}
          to={filters["created_at[1]"] ?? ""}
          onApply={(from, to) =>
            setFilters({ "created_at[0]": from, "created_at[1]": to })
          }
        />
      </FilterSlot>

      <FilterSlot
        active={!!filters.user_id}
        onClear={() => setFilter("user_id", "")}
      >
        <EmployeeSelect
          value={filters.user_id ? Number(filters.user_id) : undefined}
          onChange={(userId) =>
            setFilter("user_id", userId ? String(userId) : "")
          }
        />
      </FilterSlot>

      <FilterSlot
        active={!!filters.order_id}
        onClear={() => setFilter("order_id", "")}
      >
        <Input
          value={filters.order_id ?? ""}
          onChange={(e) => setFilter("order_id", e.target.value)}
          placeholder={t("billing.filters.order_id")}
          className="h-9 text-sm w-32"
        />
      </FilterSlot>

      {hasActiveFilters && (
        <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
          {t("billing.filters.reset_all")}
        </Button>
      )}
    </div>
  );
};

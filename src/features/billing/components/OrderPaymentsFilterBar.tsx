import { useTranslation } from "react-i18next";

import { FilterSlot } from "@/features/billing/components/FilterSlot.tsx";
import { ManagerSelect } from "@/features/orders/components/ManagerSelect.tsx";
import { useManagerOptions } from "@/features/users/hooks/useManagerOptions.ts";
import { DateRangeFilter } from "@/shared/components/common/DateRangeFilter.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";
import { PAYMENT_METHODS, PAYMENTS } from "@/shared/types.ts";
import { useFilterParams } from "@/widgets/table/hooks/useFilterParams.ts";

const ALL_VALUE = "__all__";

export const OrderPaymentsFilterBar = () => {
  const { t } = useTranslation();
  const { filters, setFilter, setFilters } = useFilterParams();
  const { users, isLoadingUsers } = useManagerOptions();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <FilterSlot
        active={!!filters["created_at[0]"]}
        onClear={() => setFilters({ "created_at[0]": "", "created_at[1]": "" })}
      >
        <DateRangeFilter
          from={filters["created_at[0]"] ?? ""}
          to={filters["created_at[1]"] ?? ""}
          onApply={(from, to) =>
            setFilters({ "created_at[0]": from, "created_at[1]": to })
          }
        />
      </FilterSlot>

      <FilterSlot
        active={!!filters.manager_id}
        onClear={() => setFilter("manager_id", "")}
      >
        <ManagerSelect
          value={filters.manager_id ? Number(filters.manager_id) : undefined}
          onChange={(val) =>
            setFilter("manager_id", val !== undefined ? String(val) : "")
          }
          users={users}
          isLoading={isLoadingUsers}
          clearable
          triggerClassName="h-9 text-sm w-48"
          placeholder={t("billing.filters.manager")}
        />
      </FilterSlot>

      <FilterSlot active={!!filters.type} onClear={() => setFilter("type", "")}>
        <Select
          value={filters.type ?? ALL_VALUE}
          onValueChange={(val) =>
            setFilter("type", val === ALL_VALUE ? "" : val)
          }
        >
          <SelectTrigger className="h-9 text-sm w-48">
            <SelectValue placeholder={t("billing.filters.type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>
              {t("billing.filters.type")}
            </SelectItem>
            {Object.values(PAYMENTS).map((type) => (
              <SelectItem key={type} value={type}>
                {t(`billing.order_payments.types.${type}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSlot>

      <FilterSlot
        active={!!filters.method}
        onClear={() => setFilter("method", "")}
      >
        <Select
          value={filters.method ?? ALL_VALUE}
          onValueChange={(val) =>
            setFilter("method", val === ALL_VALUE ? "" : val)
          }
        >
          <SelectTrigger className="h-9 text-sm w-40">
            <SelectValue placeholder={t("billing.filters.method")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>
              {t("billing.filters.method")}
            </SelectItem>
            {Object.values(PAYMENT_METHODS).map((method) => (
              <SelectItem key={method} value={method}>
                {t(`billing.order_payments.methods.${method}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSlot>

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
    </div>
  );
};

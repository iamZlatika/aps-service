import { FilterSlot } from "@/features/billing/components/FilterSlot.tsx";
import { DateRangeFilter } from "@/shared/components/common/DateRangeFilter.tsx";
import { useFilterParams } from "@/widgets/table/hooks/useFilterParams.ts";

export const BankTransactionsFilterBar = () => {
  const { filters, setFilters } = useFilterParams();

  return (
    <FilterSlot
      active={!!filters["occurred_at[0]"]}
      onClear={() => setFilters({ "occurred_at[0]": "", "occurred_at[1]": "" })}
    >
      <DateRangeFilter
        from={filters["occurred_at[0]"] ?? ""}
        to={filters["occurred_at[1]"] ?? ""}
        onApply={(from, to) =>
          setFilters({ "occurred_at[0]": from, "occurred_at[1]": to })
        }
      />
    </FilterSlot>
  );
};

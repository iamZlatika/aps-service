import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { EmployeeSelect } from "@/features/backoffice/modules/billing/components/EmployeeSelect.tsx";
import { FilterSlot } from "@/features/backoffice/modules/billing/components/FilterSlot.tsx";
import { TransactionCommonFilters } from "@/features/backoffice/modules/billing/components/TransactionCommonFilters.tsx";
import { usePendingWithdrawalsCount } from "@/features/backoffice/modules/billing/hooks/usePendingWithdrawalsCount.ts";
import { BILLING_LINKS } from "@/features/backoffice/modules/billing/navigation.ts";
import { useFilterParams } from "@/features/backoffice/widgets/table/hooks/useFilterParams.ts";
import { Button } from "@/shared/components/ui/button.tsx";

export const AllTransactionsFilterBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { filters, setFilter, resetFilters } = useFilterParams();
  const { count: pendingWithdrawalsCount } = usePendingWithdrawalsCount();

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <TransactionCommonFilters />

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

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pendingWithdrawalsCount === 0}
        onClick={() => navigate(BILLING_LINKS.withdrawalRequests())}
      >
        {t("billing.filters.withdrawal_preset")}
      </Button>

      {hasActiveFilters && (
        <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
          {t("billing.filters.reset_all")}
        </Button>
      )}
    </div>
  );
};

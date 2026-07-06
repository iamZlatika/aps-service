import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { EmployeeSelect } from "@/features/backoffice/modules/billing/components/EmployeeSelect.tsx";
import { FilterSlot } from "@/features/backoffice/modules/billing/components/FilterSlot.tsx";
import { TransactionCommonFilters } from "@/features/backoffice/modules/billing/components/TransactionCommonFilters.tsx";
import { usePendingWithdrawalsCount } from "@/features/backoffice/modules/billing/hooks/usePendingWithdrawalsCount.ts";
import { BILLING_LINKS } from "@/features/backoffice/modules/billing/navigation.ts";
import { SERVICE_VALUE } from "@/features/backoffice/modules/billing/types.ts";
import { useFilterParams } from "@/features/backoffice/widgets/table/hooks/useFilterParams.ts";
import { Button } from "@/shared/components/ui/button.tsx";

export const AllTransactionsFilterBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { filters, setFilters, resetFilters } = useFilterParams();
  const { count: pendingWithdrawalsCount } = usePendingWithdrawalsCount();

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <TransactionCommonFilters />

      <FilterSlot
        active={!!filters.user_id || !!filters.only_system}
        onClear={() => setFilters({ user_id: "", only_system: "" })}
      >
        <EmployeeSelect
          value={
            filters.only_system
              ? SERVICE_VALUE
              : filters.user_id
                ? Number(filters.user_id)
                : undefined
          }
          onChange={(val) =>
            setFilters({
              user_id: typeof val === "number" ? String(val) : "",
              only_system: val === SERVICE_VALUE ? "1" : "",
            })
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

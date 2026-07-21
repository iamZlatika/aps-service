import { useTranslation } from "react-i18next";

import { TransactionCommonFilters } from "@/features/billing/components/TransactionCommonFilters.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { TRANSACTION_TYPES } from "@/shared/types.ts";
import { useFilterParams } from "@/widgets/table/hooks/useFilterParams.ts";

export const MyTransactionsFilterBar = () => {
  const { t } = useTranslation();
  const { filters, resetFilters } = useFilterParams();

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <TransactionCommonFilters
        excludedTypes={[
          TRANSACTION_TYPES.SYSTEM_ORDER_INCOME,
          TRANSACTION_TYPES.REFERRAL_INCOME,
        ]}
      />

      {hasActiveFilters && (
        <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
          {t("billing.filters.reset_all")}
        </Button>
      )}
    </div>
  );
};

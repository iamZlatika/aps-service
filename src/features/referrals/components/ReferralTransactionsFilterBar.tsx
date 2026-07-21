import { useTranslation } from "react-i18next";

import { TransactionCommonFilters } from "@/features/billing/components/TransactionCommonFilters.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { TRANSACTION_TYPES } from "@/shared/types.ts";
import { useFilterParams } from "@/widgets/table/hooks/useFilterParams.ts";

// Referral transactions can only ever be a referral bonus or a manual
// adjustment — the rest of TRANSACTION_TYPES belongs to staff billing.
const NON_REFERRAL_TRANSACTION_TYPES = [
  TRANSACTION_TYPES.INTAKE_ORDER_INCOME,
  TRANSACTION_TYPES.SERVICE_INCOME,
  TRANSACTION_TYPES.PRODUCTS_INCOME,
  TRANSACTION_TYPES.SYSTEM_ORDER_INCOME,
  TRANSACTION_TYPES.WITHDRAWAL_REQUEST,
  TRANSACTION_TYPES.REVERSAL,
];

export const ReferralTransactionsFilterBar = () => {
  const { t } = useTranslation();
  const { filters, resetFilters } = useFilterParams();

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <TransactionCommonFilters
        excludedTypes={NON_REFERRAL_TRANSACTION_TYPES}
        showDateRange={false}
      />

      {hasActiveFilters && (
        <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
          {t("billing.filters.reset_all")}
        </Button>
      )}
    </div>
  );
};

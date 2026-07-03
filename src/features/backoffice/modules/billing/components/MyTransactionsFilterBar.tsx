import { useTranslation } from "react-i18next";

import { TransactionCommonFilters } from "@/features/backoffice/modules/billing/components/TransactionCommonFilters.tsx";
import { useFilterParams } from "@/features/backoffice/widgets/table/hooks/useFilterParams.ts";
import { Button } from "@/shared/components/ui/button.tsx";

export const MyTransactionsFilterBar = () => {
  const { t } = useTranslation();
  const { filters, resetFilters } = useFilterParams();

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <TransactionCommonFilters />

      {hasActiveFilters && (
        <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
          {t("billing.filters.reset_all")}
        </Button>
      )}
    </div>
  );
};

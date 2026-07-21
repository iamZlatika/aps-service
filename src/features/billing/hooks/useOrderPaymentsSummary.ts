import { useQuery } from "@tanstack/react-query";

import { billingApi } from "@/features/billing/api";
import { ORDER_PAYMENTS_FILTER_KEYS } from "@/features/billing/lib/constants.ts";
import { type OrderPaymentsSummary } from "@/features/billing/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { useFilterParams } from "@/widgets/table/hooks/useFilterParams.ts";
import { sanitizeFilters } from "@/widgets/table/lib/sanitizeFilters.ts";

type UseOrderPaymentsSummaryReturn = {
  summary: OrderPaymentsSummary | undefined;
  isLoading: boolean;
};

// Reads the same URL filters as the report's SmartTable (via useFilterParams)
// and sanitizes them against the same ORDER_PAYMENTS_FILTER_KEYS allow-list,
// so this never drifts out of sync with what the table sends. Pagination
// lives in a separate URL param excluded by useFilterParams, so paging alone
// never changes the query key here and never refetches the summary.
export const useOrderPaymentsSummary = (): UseOrderPaymentsSummaryReturn => {
  const { filters } = useFilterParams();
  const sanitized = sanitizeFilters(filters, [], "", [
    ...ORDER_PAYMENTS_FILTER_KEYS,
  ]);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.billing.orderPaymentsSummary(sanitized),
    queryFn: () => billingApi.orderPayments.getSummary(sanitized),
  });

  return { summary: data, isLoading };
};

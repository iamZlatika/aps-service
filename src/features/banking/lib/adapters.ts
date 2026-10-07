import type {
  BankTransactionDto,
  PaginatedBankTransactionsDto,
} from "@/features/banking/api/dto.ts";
import type { BankTransaction } from "@/features/banking/types.ts";
import type { PaginatedResponse } from "@/widgets/table/models/types.ts";

export function mapBankTransactionDtoToBankTransaction(
  dto: BankTransactionDto,
): BankTransaction {
  return {
    id: dto.id,
    amount: dto.amount,
    currencyCode: dto.currency_code,
    description: dto.description,
    comment: dto.comment,
    counterName: dto.counter_name,
    counterIban: dto.counter_iban,
    occurredAt: dto.occurred_at,
    source: dto.source,
    createdAt: dto.created_at,
  };
}

export function mapPaginatedBankTransactionsDtoToResponse(
  dto: PaginatedBankTransactionsDto,
): PaginatedResponse<BankTransaction> {
  return {
    items: dto.data.map(mapBankTransactionDtoToBankTransaction),
    meta: {
      currentPage: dto.meta.current_page,
      lastPage: dto.meta.last_page,
      total: dto.meta.total,
    },
  };
}

// The UI stores a date-range filter as two flat keys (occurred_at[0]/[1] —
// see DateRangeFilter), but this endpoint expects a real array
// param (occurred_at[]=from&occurred_at[]=to). Reshape before it reaches
// buildPaginatedParams, which already knows how to serialize array values.
export function mapBankTransactionsFiltersToApiFilters(
  filters: Record<string, string>,
): Record<string, string | string[]> {
  const { "occurred_at[0]": from, "occurred_at[1]": to, ...rest } = filters;
  return from && to ? { ...rest, occurred_at: [from, to] } : rest;
}

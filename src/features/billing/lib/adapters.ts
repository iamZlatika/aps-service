import type {
  BalanceDto,
  OrderPaymentReportDto,
  OrderPaymentsSummaryDto,
  PaginatedBalancesDto,
  PaginatedOrderPaymentsDto,
  PaginatedTransactionsDto,
  SystemBalanceDto,
  TransactionDto,
} from "@/features/billing/api/dto.ts";
import type {
  Balance,
  NewBillingTransaction,
  NewSystemBalanceTransaction,
  NewWithdrawalRequest,
  OrderPaymentRecord,
  OrderPaymentsSummary,
  SystemBalance,
  Transaction,
} from "@/features/billing/types.ts";
import {
  mapOrderProductDtoToOrderProduct,
  mapOrderServiceDtoToOrderService,
} from "@/features/orders/lib/adapters.ts";
import { mapReferralDtoToReferral } from "@/features/referrals/lib/referralAdapters.ts";
import { mapUserDtoToUser } from "@/features/users/lib/adapters.ts";
import type { PaginatedResponse } from "@/widgets/table/models/types.ts";

// Mapped by hand rather than delegating to mapOrderTransactionDtoToOrderTransaction:
// billing transactions allow a null order_id/order_number (manual/system entries),
// which is narrower than that mapper's non-nullable OrderTransactionDto param type.
export function mapTransactionDtoToTransaction(
  dto: TransactionDto,
): Transaction {
  return {
    id: dto.id,
    amount: dto.amount,
    type: dto.type,
    label: dto.label,
    status: dto.status,
    user: dto.user ? mapUserDtoToUser(dto.user) : null,
    referral: dto.referral ? mapReferralDtoToReferral(dto.referral) : null,
    orderId: dto.order_id,
    orderNumber: dto.order_number,
    orderService: dto.order_service
      ? mapOrderServiceDtoToOrderService(dto.order_service)
      : null,
    orderProduct: dto.order_product
      ? mapOrderProductDtoToOrderProduct(dto.order_product)
      : null,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    createdBy: dto.created_by ? mapUserDtoToUser(dto.created_by) : null,
    quickOrderId: dto.quick_order_id,
    quickOrderNumber: dto.quick_order_number,
  };
}

export function mapPaginatedTransactionsDtoToResponse(
  dto: PaginatedTransactionsDto,
): PaginatedResponse<Transaction> {
  return {
    items: dto.data.map(mapTransactionDtoToTransaction),
    meta: {
      currentPage: dto.meta.current_page,
      lastPage: dto.meta.last_page,
      total: dto.meta.total,
    },
  };
}

export function mapBalanceDtoToBalance(dto: BalanceDto): Balance {
  return {
    id: dto.id,
    amount: dto.amount,
    pendingAmount: dto.pending_amount,
    user: mapUserDtoToUser(dto.user),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapPaginatedBalancesDtoToResponse(
  dto: PaginatedBalancesDto,
): PaginatedResponse<Balance> {
  return {
    items: dto.data.map(mapBalanceDtoToBalance),
    meta: {
      currentPage: dto.meta.current_page,
      lastPage: dto.meta.last_page,
      total: dto.meta.total,
    },
  };
}

export function mapSystemBalanceDtoToSystemBalance(
  dto: SystemBalanceDto,
): SystemBalance {
  return { amount: dto.amount };
}

export function mapOrderPaymentReportDtoToOrderPaymentRecord(
  dto: OrderPaymentReportDto,
): OrderPaymentRecord {
  return {
    id: dto.id,
    orderId: dto.order_id,
    orderNumber: dto.order_number,
    quickOrderId: dto.quick_order_id,
    quickOrderNumber: dto.quick_order_number,
    type: dto.type,
    method: dto.method,
    amount: dto.amount,
    note: dto.note,
    manager: dto.manager ? mapUserDtoToUser(dto.manager) : null,
    createdAt: dto.created_at,
  };
}

export function mapPaginatedOrderPaymentsDtoToResponse(
  dto: PaginatedOrderPaymentsDto,
): PaginatedResponse<OrderPaymentRecord> {
  return {
    items: dto.data.map(mapOrderPaymentReportDtoToOrderPaymentRecord),
    meta: {
      currentPage: dto.meta.current_page,
      lastPage: dto.meta.last_page,
      total: dto.meta.total,
    },
  };
}

export function mapOrderPaymentsSummaryDtoToSummary(
  dto: OrderPaymentsSummaryDto,
): OrderPaymentsSummary {
  return { total: dto.total, cash: dto.cash, card: dto.card, count: dto.count };
}

// The UI stores a date-range filter as two flat keys (created_at[0]/[1] —
// see TransactionDateRangeFilter), but this endpoint expects a real array
// param (created_at[]=from&created_at[]=to). Reshape before it reaches
// buildPaginatedParams, which already knows how to serialize array values.
export function mapOrderPaymentsFiltersToApiFilters(
  filters: Record<string, string>,
): Record<string, string | string[]> {
  const { "created_at[0]": from, "created_at[1]": to, ...rest } = filters;
  return from && to ? { ...rest, created_at: [from, to] } : rest;
}

export function mapNewTransactionToDto(data: NewBillingTransaction) {
  return {
    user_id: data.userId,
    amount: data.amount,
    description: data.description,
  };
}

export function mapNewWithdrawalRequestToDto(data: NewWithdrawalRequest) {
  return {
    amount: data.amount,
    description: data.description || undefined,
  };
}

// No user_id key at all — that's what tells the backend this is a system-balance
// transaction rather than an employee adjustment (compare mapNewTransactionToDto).
export function mapNewSystemBalanceTransactionToDto(
  data: NewSystemBalanceTransaction,
) {
  return {
    amount: data.amount,
    description: data.description,
  };
}

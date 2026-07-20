import type {
  BalanceDto,
  PaginatedBalancesDto,
  PaginatedTransactionsDto,
  SystemBalanceDto,
  TransactionDto,
} from "@/features/backoffice/modules/billing/api/dto.ts";
import type {
  Balance,
  NewBillingTransaction,
  NewSystemBalanceTransaction,
  NewWithdrawalRequest,
  SystemBalance,
  Transaction,
} from "@/features/backoffice/modules/billing/types.ts";
import {
  mapOrderProductDtoToOrderProduct,
  mapOrderServiceDtoToOrderService,
} from "@/features/backoffice/modules/orders/lib/adapters.ts";
import { mapReferralDtoToReferral } from "@/features/backoffice/modules/referrals/lib/referralAdapters.ts";
import { mapUserDtoToUser } from "@/features/backoffice/modules/users/lib/adapters.ts";
import type { PaginatedResponse } from "@/features/backoffice/widgets/table/models/types.ts";

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

import {
  mapOrderProductDtoToOrderProduct,
  mapOrderServiceDtoToOrderService,
} from "@/features/backoffice/modules/orders/lib/adapters.ts";
import type {
  PaginatedReferralTransactionsDto,
  ReferralTransactionDto,
} from "@/features/backoffice/modules/referrals/api/dto.ts";
import type {
  EditReferral,
  NewReferral,
  NewReferralBalanceTransaction,
  ReferralTransaction,
} from "@/features/backoffice/modules/referrals/types.ts";
import { mapUserDtoToUser } from "@/features/backoffice/modules/users/lib/adapters.ts";
import type { PaginatedResponse } from "@/features/backoffice/widgets/table/models/types.ts";

export {
  mapPaginatedReferralsDtoToResponse,
  mapReferralDtoToReferral,
} from "@/features/backoffice/modules/referrals/lib/referralAdapters.ts";

export function mapReferralTransactionDtoToReferralTransaction(
  dto: ReferralTransactionDto,
): ReferralTransaction {
  return {
    id: dto.id,
    amount: dto.amount,
    type: dto.type,
    label: dto.label,
    status: dto.status,
    orderId: dto.order_id,
    orderNumber: dto.order_number,
    orderService: dto.order_service
      ? mapOrderServiceDtoToOrderService(dto.order_service)
      : null,
    orderProduct: dto.order_product
      ? mapOrderProductDtoToOrderProduct(dto.order_product)
      : null,
    createdBy: dto.created_by ? mapUserDtoToUser(dto.created_by) : null,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapPaginatedReferralTransactionsDtoToResponse(
  dto: PaginatedReferralTransactionsDto,
): PaginatedResponse<ReferralTransaction> {
  return {
    items: dto.data.map(mapReferralTransactionDtoToReferralTransaction),
    meta: {
      currentPage: dto.meta.current_page,
      lastPage: dto.meta.last_page,
      total: dto.meta.total,
    },
  };
}

export function mapNewReferralToDto(referral: NewReferral) {
  return {
    customer_id: referral.customerId,
    commission_percent: referral.commissionPercent,
  };
}

export function mapEditReferralToDto(referral: EditReferral) {
  return {
    commission_percent: referral.commissionPercent,
  };
}

export function mapNewReferralBalanceTransactionToDto(
  transaction: NewReferralBalanceTransaction,
) {
  return {
    amount: transaction.amount,
    description: transaction.description,
  };
}

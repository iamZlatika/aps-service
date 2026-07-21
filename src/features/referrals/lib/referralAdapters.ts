import { mapCustomerDtoToCustomer } from "@/features/customers/lib/adapters.ts";
import type {
  PaginatedReferralsDto,
  ReferralDto,
} from "@/features/referrals/api/referralResourceDto.ts";
import type { Referral } from "@/features/referrals/types.ts";
import { mapUserDtoToUser } from "@/features/users/lib/adapters.ts";
import type { PaginatedResponse } from "@/widgets/table/models/types.ts";

// Split out from lib/adapters.ts so orders/lib/adapters.ts can map
// OrderResource.referral without a circular import: lib/adapters.ts also
// depends on orders' adapters for referral transactions, but this file doesn't.
export function mapReferralDtoToReferral(dto: ReferralDto): Referral {
  return {
    id: dto.id,
    customer: mapCustomerDtoToCustomer(dto.customer),
    commissionPercent: dto.commission_percent,
    balance: dto.balance,
    pendingBalance: dto.pending_balance,
    createdBy: dto.created_by ? mapUserDtoToUser(dto.created_by) : null,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapPaginatedReferralsDtoToResponse(
  dto: PaginatedReferralsDto,
): PaginatedResponse<Referral> {
  return {
    items: dto.data.map(mapReferralDtoToReferral),
    meta: {
      currentPage: dto.meta.current_page,
      lastPage: dto.meta.last_page,
      total: dto.meta.total,
    },
  };
}

import { customersApi } from "@/features/customers/api";
import { referralsApi } from "@/features/referrals/api";
import { SEARCH_PAGE_SIZE } from "@/shared/lib/constants.ts";
import type { SearchableSelectOption } from "@/widgets/searchable-select";

export type CustomerPickerMeta = {
  phones: string[];
};

export const fetchCustomersForReferral = (
  search: string,
): Promise<SearchableSelectOption<CustomerPickerMeta>[]> =>
  customersApi
    .getAll(
      1,
      SEARCH_PAGE_SIZE,
      undefined,
      undefined,
      search ? { any_match: search } : undefined,
    )
    .then((response) =>
      response.items.map((customer) => ({
        id: customer.id,
        name: customer.name,
        meta: { phones: customer.phones.map((p) => p.phoneNumber) },
      })),
    );

export type ReferralPickerMeta = {
  commissionPercent: number;
};

export const fetchReferralsByName = (
  search: string,
): Promise<SearchableSelectOption<ReferralPickerMeta>[]> =>
  referralsApi
    .getAll(
      1,
      SEARCH_PAGE_SIZE,
      undefined,
      undefined,
      search ? { customer_name: search } : undefined,
    )
    .then((response) =>
      response.items.map((referral) => ({
        id: referral.id,
        name: referral.customer.name,
        meta: { commissionPercent: referral.commissionPercent },
      })),
    );

import { customersApi } from "@/features/customers/api";
import { SEARCH_PAGE_SIZE } from "@/shared/lib/constants.ts";
import type { SearchableSelectOption } from "@/widgets/searchable-select";

export type CustomerOptionMeta = {
  phones: string[];
};

const mapToOption = (customer: {
  id: number;
  name: string;
  phones: { phoneNumber: string }[];
}): SearchableSelectOption<CustomerOptionMeta> => ({
  id: customer.id,
  name: customer.name,
  meta: { phones: customer.phones.map((phone) => phone.phoneNumber) },
});

export const createFetchAllCustomers =
  (excludeId: number | null) =>
  (search: string): Promise<SearchableSelectOption<CustomerOptionMeta>[]> =>
    customersApi
      .getAll(
        1,
        SEARCH_PAGE_SIZE,
        undefined,
        undefined,
        search ? { any_match: search } : undefined,
      )
      .then((response) =>
        response.items
          .filter((customer) => customer.id !== excludeId)
          .map(mapToOption),
      );

export const createFetchMergeableCustomers =
  (excludeId: number | null) =>
  (search: string): Promise<SearchableSelectOption<CustomerOptionMeta>[]> =>
    customersApi
      .getAll(1, SEARCH_PAGE_SIZE, undefined, undefined, {
        ...(search ? { any_match: search } : {}),
        has_google: "0",
        has_password: "0",
        email_verified: "0",
        has_verified_phone: "0",
        telegram_subscribed: "0",
      })
      .then((response) =>
        response.items
          .filter((customer) => customer.id !== excludeId)
          .map(mapToOption),
      );

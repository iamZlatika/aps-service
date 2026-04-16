import { customersApi } from "@/features/backoffice/modules/customers/api";
import type { SearchableSelectOption } from "@/features/backoffice/modules/orders/components/searchable-select/searchableSelect.types.ts";
import { usersApi } from "@/features/backoffice/modules/users/api";
import type { PaginatedGetAllFn } from "@/shared/api/types.ts";
import { SEARCH_PAGE_SIZE } from "@/shared/lib/constants.ts";

export type CustomerByNameMeta = {
  phone: string;
  phones: string[];
};

export type CustomerByPhoneMeta = {
  customerName: string;
  phones: string[];
};

export const fetchCustomersByName = (
  search: string,
): Promise<SearchableSelectOption<CustomerByNameMeta>[]> =>
  customersApi
    .getAll(
      1,
      SEARCH_PAGE_SIZE,
      undefined,
      undefined,
      search ? { name: search } : undefined,
    )
    .then((r) =>
      r.items.map((c) => ({
        id: c.id,
        name: c.name,
        meta: {
          phone:
            c.phones.find((p) => p.isPrimary)?.phoneNumber ??
            c.phones[0]?.phoneNumber ??
            "",
          phones: c.phones.map((p) => p.phoneNumber),
        },
      })),
    );

export const fetchCustomersByPhone = (
  search: string,
): Promise<SearchableSelectOption<CustomerByPhoneMeta>[]> =>
  customersApi
    .getAll(
      1,
      SEARCH_PAGE_SIZE,
      undefined,
      undefined,
      search ? { phone_number: search } : undefined,
    )
    .then((r) =>
      r.items.map((c) => ({
        id: c.id,
        name:
          c.phones.find((p) => p.isPrimary)?.phoneNumber ??
          c.phones[0]?.phoneNumber ??
          "",
        meta: {
          customerName: c.name,
          phones: c.phones.map((p) => p.phoneNumber),
        },
      })),
    );

export const fetchUsersByName = (
  search: string,
): Promise<SearchableSelectOption[]> =>
  usersApi
    .getAll(
      1,
      SEARCH_PAGE_SIZE,
      undefined,
      undefined,
      search ? { name: search } : undefined,
    )
    .then((r) => r.items.map((u) => ({ id: u.id, name: u.name })));

export const fetchByDictionaryName =
  (apiFn: PaginatedGetAllFn) =>
  (search: string): Promise<SearchableSelectOption[]> =>
    apiFn(
      1,
      SEARCH_PAGE_SIZE,
      undefined,
      undefined,
      search ? { name: search } : undefined,
    ).then((r) =>
      r.items.map((item) => ({ id: item.id, name: item.name as string })),
    );

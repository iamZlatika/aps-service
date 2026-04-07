import { useMutation } from "@tanstack/react-query";
import type { UseFormSetError } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { customersApi } from "@/features/backoffice/modules/customers/api";
import {
  accessoriesApi,
  deviceConditionsApi,
  deviceModelsApi,
  deviceTypesApi,
  intakeNotesApi,
  issueTypesApi,
  manufacturersApi,
} from "@/features/backoffice/modules/dictionaries/api";
import { ordersApi } from "@/features/backoffice/modules/orders/api";
import type { SearchableSelectOption } from "@/features/backoffice/modules/orders/components/searchable-select/searchableSelect.types.ts";
import type { NewOrderSchema } from "@/features/backoffice/modules/orders/lib/schema.ts";
import { ORDERS_LINKS } from "@/features/backoffice/modules/orders/navigation.ts";
import type { NewOrder } from "@/features/backoffice/modules/orders/types.ts";
import { usersApi } from "@/features/backoffice/modules/users/api";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { type PaginatedGetAllFn } from "@/shared/api/types.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

const PAGE_SIZE = 30;

const fetchByDictionaryName =
  (apiFn: PaginatedGetAllFn) =>
  (search: string): Promise<SearchableSelectOption[]> =>
    apiFn(
      1,
      PAGE_SIZE,
      undefined,
      undefined,
      search ? { name: search } : undefined,
    ).then((r) =>
      r.items.map((item) => ({ id: item.id, name: item.name as string })),
    );

const fetchCustomersByName = (
  search: string,
): Promise<SearchableSelectOption[]> =>
  customersApi
    .getAll(
      1,
      PAGE_SIZE,
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

const fetchCustomersByPhone = (
  search: string,
): Promise<SearchableSelectOption[]> =>
  customersApi
    .getAll(
      1,
      PAGE_SIZE,
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

const fetchUsersByName = (search: string): Promise<SearchableSelectOption[]> =>
  usersApi
    .getAll(
      1,
      PAGE_SIZE,
      undefined,
      undefined,
      search ? { name: search } : undefined,
    )
    .then((r) => r.items.map((u) => ({ id: u.id, name: u.name })));

type UseCreateOrderReturn = {
  onSubmit: (values: NewOrderSchema) => Promise<void>;
  isPending: boolean;
  fetchCustomersByName: (search: string) => Promise<SearchableSelectOption[]>;
  fetchCustomersByPhone: (search: string) => Promise<SearchableSelectOption[]>;
  fetchUsersByName: (search: string) => Promise<SearchableSelectOption[]>;
  fetchByDictionaryName: (
    apiFn: PaginatedGetAllFn,
  ) => (search: string) => Promise<SearchableSelectOption[]>;
  dictionaryApis: {
    issueTypes: PaginatedGetAllFn;
    deviceTypes: PaginatedGetAllFn;
    manufacturers: PaginatedGetAllFn;
    deviceModels: PaginatedGetAllFn;
    deviceConditions: PaginatedGetAllFn;
    accessories: PaginatedGetAllFn;
    intakeNotes: PaginatedGetAllFn;
  };
};

export const useCreateOrder = (
  setError: UseFormSetError<NewOrderSchema>,
): UseCreateOrderReturn => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: NewOrder) => ordersApi.addNewOrder(data),
    onSuccess: () => {
      navigate(ORDERS_LINKS.root());
      return queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });

  const onSubmit = async (values: NewOrderSchema) => {
    try {
      await mutation.mutateAsync(values as unknown as NewOrder);
    } catch (error) {
      handleFormError(error, setError);
    }
  };

  return {
    onSubmit,
    isPending: mutation.isPending,
    fetchCustomersByName,
    fetchCustomersByPhone,
    fetchUsersByName,
    fetchByDictionaryName,
    dictionaryApis: {
      issueTypes: issueTypesApi.getAll,
      deviceTypes: deviceTypesApi.getAll,
      manufacturers: manufacturersApi.getAll,
      deviceModels: deviceModelsApi.getAll,
      deviceConditions: deviceConditionsApi.getAll,
      accessories: accessoriesApi.getAll,
      intakeNotes: intakeNotesApi.getAll,
    },
  };
};

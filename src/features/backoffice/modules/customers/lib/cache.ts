import type { Customer } from "@/features/backoffice/modules/customers/types.ts";
import type { PaginatedResponse } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

export async function updateCustomerCache(
  updatedCustomer: Customer,
): Promise<void> {
  await queryClient.invalidateQueries({
    queryKey: queryKeys.customers.detail(updatedCustomer.id),
  });
  queryClient.setQueriesData<PaginatedResponse<Customer>>(
    { queryKey: queryKeys.customers.list() },
    (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        items: oldData.items.map((item) =>
          item.id === updatedCustomer.id ? updatedCustomer : item,
        ),
      };
    },
  );
}

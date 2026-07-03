import type { Customer } from "@/features/backoffice/modules/customers/types.ts";
import type { OrderInfo } from "@/features/backoffice/modules/orders/types.ts";
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
  queryClient.setQueriesData<OrderInfo>(
    { queryKey: ["orders", "detail"] },
    (old) => {
      if (!old || old.customer.id !== updatedCustomer.id) return old;
      return { ...old, customer: { ...old.customer, ...updatedCustomer } };
    },
  );
}

import type { Customer } from "@/features/customers/types.ts";
import type { OrderInfo } from "@/features/orders/types.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import type { PaginatedResponse } from "@/widgets/table/models/types.ts";

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
    { queryKey: queryKeys.orders.detailAll() },
    (old) => {
      if (!old || old.customer.id !== updatedCustomer.id) return old;
      return { ...old, customer: { ...old.customer, ...updatedCustomer } };
    },
  );
}

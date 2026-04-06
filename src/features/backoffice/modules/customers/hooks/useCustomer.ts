import { useQuery } from "@tanstack/react-query";

import { customersApi } from "@/features/backoffice/modules/customers/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";

export const useCustomer = (customerId: number | null) => {
  const { data: selectedCustomer, isLoading } = useQuery({
    queryKey: queryKeys.customers.detail(customerId!),
    queryFn: () => customersApi.getCustomer(customerId!),
    enabled: customerId !== null,
  });

  return { selectedCustomer, isLoading };
};

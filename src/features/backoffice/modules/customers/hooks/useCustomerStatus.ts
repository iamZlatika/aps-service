import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { customersApi } from "@/features/backoffice/modules/customers/api";
import type { Customer } from "@/features/backoffice/modules/customers/types.ts";
import type { PaginatedResponse } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import type { UserStatus } from "@/shared/types.ts";

export const useCustomerStatus = (
  customerId: number | null,
  customer: Customer | undefined,
) => {
  const [isConfirmOpened, setIsConfirmOpened] = useState(false);

  const isActive = customer?.status === "active";
  const newStatus: UserStatus = isActive ? "blocked" : "active";

  const changeStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: UserStatus }) =>
      customersApi.changeCustomerStatus(id, status),
    onSuccess: (updatedCustomer) => {
      queryClient.setQueryData(
        queryKeys.customers.detail(updatedCustomer.id),
        updatedCustomer,
      );

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
    },
  });

  const handleConfirm = useCallback(() => {
    if (customerId) {
      setIsConfirmOpened(false);
      changeStatusMutation.mutate({ id: customerId, status: newStatus });
    }
  }, [changeStatusMutation, customerId, newStatus]);

  return {
    isConfirmOpened,
    setIsConfirmOpened,
    handleConfirm,
    isStatusPending: changeStatusMutation.isPending,
  };
};

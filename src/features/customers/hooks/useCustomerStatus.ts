import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { customersApi } from "@/features/customers/api";
import { updateCustomerCache } from "@/features/customers/lib/cache.ts";
import type { Customer } from "@/features/customers/types.ts";
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
    onSuccess: updateCustomerCache,
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

import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { toast } from "sonner";

import { ordersApi } from "@/features/orders/api";
import { useManagerOptions } from "@/features/users/hooks/useManagerOptions.ts";
import type { User } from "@/features/users/types.ts";
import { queryKeys } from "@/shared/api/queryKeys";
import { notifyError } from "@/shared/lib/errors/services.ts";

type UseChangeOrderManagerReturn = {
  users: User[];
  isLoadingUsers: boolean;
  changeManager: (managerId: number) => void;
  isPending: boolean;
};

export function useChangeOrderManager(
  orderId: number,
  onSuccess: () => void,
): UseChangeOrderManagerReturn {
  const queryClient = useQueryClient();

  const { users, isLoadingUsers } = useManagerOptions({ activeOnly: true });

  const mutation = useMutation({
    mutationFn: (managerId: number) =>
      ordersApi.changeManager(orderId, managerId),
    onSuccess: () => {
      toast.success(i18next.t("orders.changeManager.success"));
      onSuccess();
      return queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(orderId),
      });
    },
    onError: (error) => notifyError(error),
  });

  return {
    users,
    isLoadingUsers,
    changeManager: mutation.mutate,
    isPending: mutation.isPending,
  };
}

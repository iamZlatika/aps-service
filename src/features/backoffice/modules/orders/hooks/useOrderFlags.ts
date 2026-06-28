import { useMutation } from "@tanstack/react-query";

import { ordersApi } from "@/features/backoffice/modules/orders/api";
import type { OrderInfo } from "@/features/backoffice/modules/orders/types.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseOrderFlagsReturn = {
  toggleCalled: (value: boolean) => void;
  calledPending: boolean;
  toggleUrgent: (value: boolean) => void;
  urgentPending: boolean;
};

const patchOrderDetail = (orderId: number, patch: Partial<OrderInfo>): void => {
  queryClient.setQueryData(
    queryKeys.orders.detail(orderId),
    (old: OrderInfo | undefined) => (old ? { ...old, ...patch } : old),
  );
};

export const useOrderFlags = (orderId: number): UseOrderFlagsReturn => {
  const { mutate: toggleCalled, isPending: calledPending } = useMutation({
    mutationFn: (value: boolean) => ordersApi.changeIsCalled(orderId, value),
    onSuccess: (_data, value) => {
      patchOrderDetail(orderId, { isCalled: value });
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.list() });
    },
  });

  const { mutate: toggleUrgent, isPending: urgentPending } = useMutation({
    mutationFn: (value: boolean) => ordersApi.changeIsUrgent(orderId, value),
    onSuccess: ({ isUrgent, dueDate }) => {
      patchOrderDetail(orderId, { isUrgent, dueDate });
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.list() });
    },
  });

  return { toggleCalled, calledPending, toggleUrgent, urgentPending };
};

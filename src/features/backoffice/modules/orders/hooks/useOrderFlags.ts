import { useMutation } from "@tanstack/react-query";
import { addDays, format, parseISO } from "date-fns";

import { ordersApi } from "@/features/backoffice/modules/orders/api";
import { mapOrderInfoToEditFormValues } from "@/features/backoffice/modules/orders/lib/adapters.ts";
import type { OrderInfo } from "@/features/backoffice/modules/orders/types.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseOrderFlagsReturn = {
  toggleCalled: (value: boolean) => void;
  calledPending: boolean;
  toggleUrgent: (value: boolean) => void;
  urgentPending: boolean;
};

export const useOrderFlags = (
  orderId: number,
  order: OrderInfo,
): UseOrderFlagsReturn => {
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.orders.all,
    });

  const { mutate: toggleCalled, isPending: calledPending } = useMutation({
    mutationFn: (value: boolean) => ordersApi.changeIsCalled(orderId, value),
    onSuccess: invalidate,
  });

  const { mutate: toggleUrgent, isPending: urgentPending } = useMutation({
    mutationFn: async (value: boolean) => {
      await ordersApi.changeIsUrgent(orderId, value);
      const dueDate = value
        ? format(addDays(new Date(), 1), "yyyy-MM-dd")
        : format(addDays(parseISO(order.createdAt), 5), "yyyy-MM-dd");
      await ordersApi.changeOrderInfo(orderId, {
        ...mapOrderInfoToEditFormValues(order),
        dueDate,
      });
    },
    onSuccess: invalidate,
  });

  return { toggleCalled, calledPending, toggleUrgent, urgentPending };
};

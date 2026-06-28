import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { orderStatusesApi } from "@/features/backoffice/modules/dictionaries/api";
import type { OrderStatusDto } from "@/features/backoffice/modules/dictionaries/api/dto.ts";
import { ordersApi } from "@/features/backoffice/modules/orders/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const STATUSES_THAT_RESET_IS_CALLED = [
  "waiting_for_approval",
  "ready",
] as const;

type UseChangeOrderStatusReturn = {
  statuses: OrderStatusDto[];
  changeStatus: (id: number, key: string) => void;
  isPending: boolean;
};

export const useChangeOrderStatus = (
  orderId: number,
  onSuccess?: () => void,
): UseChangeOrderStatusReturn => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: queryKeys.dictionaries.orderStatuses(),
    queryFn: () => orderStatusesApi.getAll(1, 100),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id }: { id: number; key: string }) =>
      ordersApi.changeStatus(orderId, id),
    onSuccess: (_, { key }) => {
      const resetsIsCalled = (
        STATUSES_THAT_RESET_IS_CALLED as readonly string[]
      ).includes(key);
      if (onSuccess) {
        onSuccess();
        if (resetsIsCalled) {
          void queryClient.invalidateQueries({
            queryKey: queryKeys.orders.all,
          });
        }
      } else {
        void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      }
    },
  });

  return {
    statuses: data?.items ?? [],
    changeStatus: (id, key) => mutate({ id, key }),
    isPending,
  };
};

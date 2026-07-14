import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { type OrderStatus } from "@/entities/order-status/types";
import { orderStatusesApi } from "@/features/backoffice/modules/dictionaries/api";
import { ordersApi } from "@/features/backoffice/modules/orders/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseChangeOrderStatusReturn = {
  statuses: OrderStatus[];
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
    onSuccess: () => {
      onSuccess?.();
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });

  return {
    statuses: data?.items ?? [],
    changeStatus: (id, key) => mutate({ id, key }),
    isPending,
  };
};

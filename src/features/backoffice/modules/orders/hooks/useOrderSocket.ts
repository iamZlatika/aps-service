import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { mapOrderDtoToOrder } from "@/features/backoffice/modules/orders/lib/adapters";
import {
  type OrderInfo,
  type OrderSocketEvent,
} from "@/features/backoffice/modules/orders/types";
import { queryKeys } from "@/shared/api/queryKeys";
import { getEcho } from "@/shared/lib/echo";

const ORDER_UPDATE_EVENTS = [
  ".order.status_changed",
  ".order.updated",
  ".order.urgency_changed",
  ".order.called_changed",
] as const;

export const useOrderSocket = (orderId: number): void => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    const channelName = `backoffice.orders.${orderId}`;
    const channel = echo.private(channelName);

    const handleEvent = (e: OrderSocketEvent): void => {
      const { customer: _customer, ...orderFields } = mapOrderDtoToOrder(
        e.data.order,
      );
      queryClient.setQueryData<OrderInfo>(
        queryKeys.orders.detail(orderId),
        (old) => {
          if (!old) return old;
          return { ...old, ...orderFields };
        },
      );
    };

    ORDER_UPDATE_EVENTS.forEach((event) => channel.listen(event, handleEvent));

    return () => {
      echo.leave(channelName);
    };
  }, [orderId, queryClient]);
};

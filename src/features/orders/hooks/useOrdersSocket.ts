import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { mapOrderDtoToOrder } from "@/features/orders/lib/adapters";
import { type Order, type OrderSocketEvent } from "@/features/orders/types";
import { queryKeys } from "@/shared/api/queryKeys";
import { getEcho } from "@/shared/lib/echo";
import { type PaginatedResponse } from "@/widgets/table/models/types";

const ORDER_UPDATE_EVENTS = [
  ".order.status_changed",
  ".order.updated",
  ".order.urgency_changed",
  ".order.called_changed",
  ".order.payment_changed",
  ".order.service_changed",
  ".order.product_changed",
] as const;

export const useOrdersSocket = (): void => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    const channel = echo.private("backoffice.orders");

    const handleUpdate = (e: OrderSocketEvent): void => {
      const updatedOrder = mapOrderDtoToOrder(e.data.order);
      queryClient.setQueriesData<PaginatedResponse<Order>>(
        { queryKey: queryKeys.orders.list() },
        (old) => {
          if (!old) return old;
          const idx = old.items.findIndex((o) => o.id === updatedOrder.id);
          if (idx === -1) return old;
          const items = [...old.items];
          items[idx] = updatedOrder;
          return { ...old, items };
        },
      );
    };

    const handleCreate = (): void => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.list() });
    };

    ORDER_UPDATE_EVENTS.forEach((event) => channel.listen(event, handleUpdate));
    channel.listen(".order.created", handleCreate);

    return () => {
      echo.leave("backoffice.orders");
    };
  }, [queryClient]);
};

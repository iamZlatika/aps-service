import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { mapTelegramDtoToTelegram } from "@/features/customers/lib/adapters.ts";
import type { CustomerTelegramLinkedSocketEvent } from "@/features/customers/types.ts";
import type { OrderInfo } from "@/features/orders/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { getEcho } from "@/shared/lib/echo";

// CustomerInfoCard on the order page renders the same Telegram subscription
// section as the customer page, but reads it off `OrderInfo.customer`, not
// off `queryKeys.customers.detail`. useOrderSocket's mergeOrderFields
// deliberately excludes `customer`, so that copy needs its own listener on
// the customer's channel to stay live here.
export const useOrderCustomerTelegramSocket = (
  orderId: number,
  customerId: number | null,
): void => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (customerId === null) return;

    const echo = getEcho();
    if (!echo) return;

    const channelName = `backoffice.customers.${customerId}`;
    const channel = echo.private(channelName);

    const updateCustomerTelegram = (
      telegram: OrderInfo["customer"]["telegram"],
    ): void => {
      queryClient.setQueryData<OrderInfo>(
        queryKeys.orders.detail(orderId),
        (old) =>
          old ? { ...old, customer: { ...old.customer, telegram } } : old,
      );
    };

    const handleLinked = (e: CustomerTelegramLinkedSocketEvent): void => {
      updateCustomerTelegram(mapTelegramDtoToTelegram(e.data.telegram));
    };

    const handleUnlinked = (): void => {
      updateCustomerTelegram(null);
    };

    channel.listen(".customer.telegram_linked", handleLinked);
    channel.listen(".customer.telegram_unlinked", handleUnlinked);

    return () => {
      echo.leave(channelName);
    };
  }, [orderId, customerId, queryClient]);
};

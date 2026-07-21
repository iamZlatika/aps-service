import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { mapTelegramDtoToTelegram } from "@/features/customers/lib/adapters.ts";
import type {
  CustomerInfo,
  CustomerTelegramLinkedSocketEvent,
} from "@/features/customers/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { getEcho } from "@/shared/lib/echo";

export const useCustomerTelegramSocket = (customerId: number | null): void => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (customerId === null) return;

    const echo = getEcho();
    if (!echo) return;

    const channelName = `backoffice.customers.${customerId}`;
    const channel = echo.private(channelName);

    const handleLinked = (e: CustomerTelegramLinkedSocketEvent): void => {
      const telegram = mapTelegramDtoToTelegram(e.data.telegram);
      queryClient.setQueryData<CustomerInfo>(
        queryKeys.customers.detail(customerId),
        (old) => (old ? { ...old, telegram } : old),
      );
    };

    const handleUnlinked = (): void => {
      queryClient.setQueryData<CustomerInfo>(
        queryKeys.customers.detail(customerId),
        (old) => (old ? { ...old, telegram: null } : old),
      );
    };

    channel.listen(".customer.telegram_linked", handleLinked);
    channel.listen(".customer.telegram_unlinked", handleUnlinked);

    return () => {
      echo.leave(channelName);
    };
  }, [customerId, queryClient]);
};

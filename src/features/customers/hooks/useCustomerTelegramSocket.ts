import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { mapTelegramDtoToTelegram } from "@/features/customers/lib/adapters.ts";
import type {
  CustomerInfo,
  CustomerTelegramLinkedSocketEvent,
} from "@/features/customers/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { useEcho } from "@/shared/hooks/useEcho";

export const useCustomerTelegramSocket = (customerId: number | null): void => {
  const queryClient = useQueryClient();
  const echo = useEcho();

  useEffect(() => {
    if (customerId === null) return;

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
  }, [customerId, echo, queryClient]);
};

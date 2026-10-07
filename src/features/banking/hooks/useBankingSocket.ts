import { useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { useEffect } from "react";
import { toast } from "sonner";

import { mapBankTransactionDtoToBankTransaction } from "@/features/banking/lib/adapters.ts";
import type { BankTransactionReceivedSocketEvent } from "@/features/banking/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { getEcho } from "@/shared/lib/echo";
import { formatMoney } from "@/shared/lib/utils.ts";

const CHANNEL_NAME = "backoffice.banking";

export const useBankingSocket = (): void => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    const channel = echo.private(CHANNEL_NAME);

    const handleReceived = (e: BankTransactionReceivedSocketEvent): void => {
      const transaction = mapBankTransactionDtoToBankTransaction(
        e.data.transaction,
      );
      toast.success(
        i18next.t("banking.toast.received", {
          amount: formatMoney(transaction.amount),
        }),
        {
          description:
            transaction.description ?? transaction.counterName ?? undefined,
        },
      );
      void queryClient.invalidateQueries({
        queryKey: queryKeys.banking.transactions(),
      });
    };

    channel.listen(".bank_transaction.received", handleReceived);

    return () => {
      echo.leave(CHANNEL_NAME);
    };
  }, [queryClient]);
};

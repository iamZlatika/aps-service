import { useMutation, useQueryClient } from "@tanstack/react-query";

import { bankCardsApi } from "@/features/dictionaries/api";
import type { BankCard } from "@/features/dictionaries/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { notifyError } from "@/shared/lib/errors/services.ts";

type UseToggleBankCardStatusReturn = {
  toggle: () => void;
  isPending: boolean;
};

export const useToggleBankCardStatus = (
  card: BankCard,
): UseToggleBankCardStatusReturn => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => bankCardsApi.toggleActive(card.id, !card.isActive),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.dictionaries.bankCards(),
      });
    },
    onError: (error) => notifyError(error),
  });

  return { toggle: mutate, isPending };
};

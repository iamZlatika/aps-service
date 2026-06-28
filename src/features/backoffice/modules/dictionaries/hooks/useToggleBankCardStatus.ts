import { useMutation, useQueryClient } from "@tanstack/react-query";

import { bankCardsApi } from "@/features/backoffice/modules/dictionaries/api";
import type { BankCardDto } from "@/features/backoffice/modules/dictionaries/api/dto.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { notifyError } from "@/shared/lib/errors/services.ts";

type UseToggleBankCardStatusReturn = {
  toggle: () => void;
  isPending: boolean;
};

export const useToggleBankCardStatus = (
  card: BankCardDto,
): UseToggleBankCardStatusReturn => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => bankCardsApi.toggleActive(card.id, !card.is_active),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.dictionaries.bankCards(),
      });
    },
    onError: (error) => notifyError(error),
  });

  return { toggle: mutate, isPending };
};
